import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  upsertStreamUser,
  generateStreamToken,
  getOrCreateRequestChannel,
  addMemberToChannel,
  removeMemberFromChannel,
} from "../services/streamService.js";

const router = express.Router();

// GET /api/stream/token — exchange app JWT for a Stream user token
router.get("/token", authenticateToken, async (req, res) => {
  try {
    const { id, email, role } = req.user;
    const { rows } = await pool.query(
      "SELECT id, email, name, role FROM users WHERE id = $1",
      [id]
    );
    const user = rows[0];
    await upsertStreamUser({ id, name: user?.name, email, role });
    const token = generateStreamToken(id);
    res.json({ token, apiKey: process.env.STREAM_API_KEY, userId: String(id) });
  } catch (err) {
    console.error("Stream token error:", err);
    res.status(500).json({ message: "Failed to generate Stream token" });
  }
});

// POST /api/stream/channels/:requestId — BA creates/ensures channel exists
router.post("/channels/:requestId", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "ba") return res.status(403).json({ message: "BA only" });
    const { requestId } = req.params;

    const { rows } = await pool.query(
      "SELECT req_number, stakeholder_id FROM requests WHERE id = $1 AND assigned_ba_id = $2",
      [requestId, req.user.id]
    );
    if (!rows.length) return res.status(403).json({ message: "Not your request" });

    const { req_number, stakeholder_id } = rows[0];
    const result = await getOrCreateRequestChannel(requestId, req.user.id, req_number);

    // Mirror BA in channel_members
    await pool.query(
      `INSERT INTO channel_members (request_id, user_id, stream_role)
       VALUES ($1, $2, 'moderator') ON CONFLICT (request_id, user_id) DO NOTHING`,
      [requestId, req.user.id]
    );

    // Auto-add the stakeholder as member if not already present
    if (stakeholder_id) {
      const alreadyIn = await pool.query(
        "SELECT 1 FROM channel_members WHERE request_id = $1 AND user_id = $2",
        [requestId, stakeholder_id]
      );
      if (!alreadyIn.rows.length) {
        const sh = await pool.query(
          "SELECT id, email, name, role FROM users WHERE id = $1",
          [stakeholder_id]
        );
        if (sh.rows.length) {
          await upsertStreamUser(sh.rows[0]);
          await addMemberToChannel(requestId, stakeholder_id, "member");
          await pool.query(
            `INSERT INTO channel_members (request_id, user_id, stream_role)
             VALUES ($1, $2, 'member') ON CONFLICT (request_id, user_id) DO NOTHING`,
            [requestId, stakeholder_id]
          );
        }
      }
    }

    res.json(result);
  } catch (err) {
    console.error("Create channel error:", err);
    res.status(500).json({ message: "Failed to create channel" });
  }
});

// POST /api/stream/channels/:requestId/members — BA adds a user to the channel
router.post("/channels/:requestId/members", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "ba") return res.status(403).json({ message: "BA only" });
    const { requestId } = req.params;
    const { userId, role: memberRole } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });

    // Verify BA owns this channel
    const { rows: owns } = await pool.query(
      "SELECT id FROM requests WHERE id = $1 AND assigned_ba_id = $2",
      [requestId, req.user.id]
    );
    if (!owns.length) return res.status(403).json({ message: "Not your request" });

    const { rows: target } = await pool.query(
      "SELECT id, email, name, role FROM users WHERE id = $1",
      [userId]
    );
    if (!target.length) return res.status(404).json({ message: "User not found" });

    const streamRole = memberRole === "moderator" ? "moderator" : "member";
    await upsertStreamUser(target[0]);
    await addMemberToChannel(requestId, userId, streamRole);

    await pool.query(
      `INSERT INTO channel_members (request_id, user_id, stream_role)
       VALUES ($1, $2, $3)
       ON CONFLICT (request_id, user_id) DO UPDATE SET stream_role = EXCLUDED.stream_role`,
      [requestId, userId, streamRole]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("Add member error:", err);
    res.status(500).json({ message: "Failed to add member" });
  }
});

// DELETE /api/stream/channels/:requestId/members/:userId — BA removes a user
router.delete("/channels/:requestId/members/:userId", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "ba") return res.status(403).json({ message: "BA only" });
    const { requestId, userId } = req.params;

    await removeMemberFromChannel(requestId, userId);
    await pool.query(
      "DELETE FROM channel_members WHERE request_id = $1 AND user_id = $2",
      [requestId, userId]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("Remove member error:", err);
    res.status(500).json({ message: "Failed to remove member" });
  }
});

// GET /api/stream/channels/:requestId/members — list current members (DB-backed)
router.get("/channels/:requestId/members", authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, cm.stream_role, cm.added_at
       FROM channel_members cm
       JOIN users u ON u.id = cm.user_id
       WHERE cm.request_id = $1
       ORDER BY cm.added_at ASC`,
      [requestId]
    );
    res.json({ members: rows });
  } catch (err) {
    console.error("Get members error:", err);
    res.status(500).json({ message: "Failed to get members" });
  }
});

// GET /api/stream/users — list all users for BA's add-member dropdown
router.get("/users", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "ba") return res.status(403).json({ message: "BA only" });
    const { rows } = await pool.query(
      "SELECT id, email, name, role FROM users WHERE id != $1 ORDER BY role, name, email",
      [req.user.id]
    );
    res.json({ users: rows });
  } catch (err) {
    console.error("List users error:", err);
    res.status(500).json({ message: "Failed to list users" });
  }
});

// GET /api/stream/channels/:requestId/important — list important messages
router.get("/channels/:requestId/important", authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { rows } = await pool.query(
      `SELECT stream_message_id, message_text, sender_name, marked_at
       FROM important_messages WHERE request_id = $1 ORDER BY marked_at ASC`,
      [requestId]
    );
    res.json({ messages: rows });
  } catch (err) {
    console.error("Get important messages error:", err);
    res.status(500).json({ message: "Failed to get important messages" });
  }
});

// POST /api/stream/channels/:requestId/important — mark a message as important
router.post("/channels/:requestId/important", authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { streamMessageId, messageText, senderName } = req.body;
    if (!streamMessageId) return res.status(400).json({ message: "streamMessageId required" });
    await pool.query(
      `INSERT INTO important_messages (request_id, stream_message_id, message_text, sender_name, marked_by)
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (request_id, stream_message_id) DO NOTHING`,
      [requestId, streamMessageId, messageText || "", senderName || "", req.user.id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Mark important error:", err);
    res.status(500).json({ message: "Failed to mark message" });
  }
});

// DELETE /api/stream/channels/:requestId/important/:messageId — unmark a message
router.delete("/channels/:requestId/important/:messageId", authenticateToken, async (req, res) => {
  try {
    const { requestId, messageId } = req.params;
    await pool.query(
      `DELETE FROM important_messages WHERE request_id = $1 AND stream_message_id = $2`,
      [requestId, messageId]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Unmark important error:", err);
    res.status(500).json({ message: "Failed to unmark message" });
  }
});

// POST /api/stream/daily/rooms — create a Daily.co video room
router.post("/daily/rooms", authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.body;
    if (!requestId) return res.status(400).json({ message: "requestId required" });

    const roomName = `brd-${requestId}-${Date.now()}`;
    const exp = Math.floor(Date.now() / 1000) + 7200; // 2 hours

    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: roomName,
        properties: {
          exp,
          enable_prejoin_ui: true,
          enable_chat: false,
          enable_screenshare: true,
          max_participants: 20,
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Daily API error:", text);
      return res.status(500).json({ message: "Failed to create Daily room" });
    }

    const data = await response.json();
    res.json({ url: data.url, name: data.name });
  } catch (err) {
    console.error("Daily room error:", err);
    res.status(500).json({ message: "Failed to create Daily room" });
  }
});

export default router;
