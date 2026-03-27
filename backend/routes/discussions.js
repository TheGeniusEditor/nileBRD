import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/discussions/requests — active requests the current user can chat about
// Stakeholder: requests they submitted
// BA: requests assigned to them
router.get("/requests", authenticateToken, async (req, res) => {
  try {
    let query;
    if (req.user.role === "stakeholder") {
      query = {
        text: `SELECT r.id, r.req_number, r.title, r.priority, r.category, r.status,
                      u.name AS ba_name, u.email AS ba_email,
                      (SELECT COUNT(*) FROM request_messages m WHERE m.request_id = r.id) AS message_count,
                      (SELECT m2.message FROM request_messages m2 WHERE m2.request_id = r.id ORDER BY m2.created_at DESC LIMIT 1) AS last_message,
                      (SELECT m3.created_at FROM request_messages m3 WHERE m3.request_id = r.id ORDER BY m3.created_at DESC LIMIT 1) AS last_message_at
               FROM requests r
               LEFT JOIN users u ON u.id = r.assigned_ba_id
               WHERE r.stakeholder_id = $1 AND r.status != 'Closed'
               ORDER BY COALESCE(last_message_at, r.created_at) DESC`,
        values: [req.user.id],
      };
    } else if (req.user.role === "ba") {
      query = {
        text: `SELECT r.id, r.req_number, r.title, r.priority, r.category, r.status,
                      u.name AS stakeholder_name, u.email AS stakeholder_email,
                      (SELECT COUNT(*) FROM request_messages m WHERE m.request_id = r.id) AS message_count,
                      (SELECT m2.message FROM request_messages m2 WHERE m2.request_id = r.id ORDER BY m2.created_at DESC LIMIT 1) AS last_message,
                      (SELECT m3.created_at FROM request_messages m3 WHERE m3.request_id = r.id ORDER BY m3.created_at DESC LIMIT 1) AS last_message_at
               FROM requests r
               LEFT JOIN users u ON u.id = r.stakeholder_id
               WHERE r.assigned_ba_id = $1 AND r.status != 'Closed'
               ORDER BY COALESCE(last_message_at, r.created_at) DESC`,
        values: [req.user.id],
      };
    } else {
      return res.json({ requests: [] });
    }

    const result = await pool.query(query);
    res.json({ requests: result.rows });
  } catch (error) {
    console.error("Discussions requests error:", error);
    res.status(500).json({ message: "Error fetching requests" });
  }
});

// GET /api/discussions/messages/:requestId — message history (last 100)
router.get("/messages/:requestId", authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;

    // Verify user has access to this request
    const access = await pool.query(
      "SELECT id FROM requests WHERE id = $1 AND (stakeholder_id = $2 OR assigned_ba_id = $2)",
      [requestId, req.user.id]
    );
    if (access.rows.length === 0) {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await pool.query(
      `SELECT m.id, m.request_id, m.message, m.created_at,
              m.reply_to_id,
              u.id AS sender_id, u.email AS sender_email, u.name AS sender_name, u.role AS sender_role,
              -- replied-to message snapshot
              rm.message AS reply_text,
              ru.name AS reply_sender_name, ru.email AS reply_sender_email
       FROM request_messages m
       JOIN users u ON u.id = m.sender_id
       LEFT JOIN request_messages rm ON rm.id = m.reply_to_id
       LEFT JOIN users ru ON ru.id = rm.sender_id
       WHERE m.request_id = $1
       ORDER BY m.created_at ASC
       LIMIT 100`,
      [requestId]
    );

    res.json({ messages: result.rows });
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

export default router;
