import pool from "../config/db.js";

export async function logAdminAction(adminId, action, details = null) {
  try {
    await pool.query(
      "INSERT INTO admin_audit_logs (admin_id, action, details, timestamp) VALUES ($1, $2, $3, NOW())",
      [adminId, action, details ? JSON.stringify(details) : null]
    );
  } catch (error) {
    console.error("Failed to log admin action:", error);
    // Don't throw error to prevent admin actions from failing due to logging issues
  }
}

export async function getAdminAuditLogs(limit = 50) {
  try {
    const result = await pool.query(
      "SELECT * FROM admin_audit_logs ORDER BY timestamp DESC LIMIT $1",
      [limit]
    );
    return result.rows;
  } catch (error) {
    throw new Error("Failed to fetch audit logs");
  }
}

export async function logAdminLogin(adminId, success, ipAddress = null) {
  try {
    await pool.query(
      "INSERT INTO admin_audit_logs (admin_id, action, details, timestamp) VALUES ($1, $2, $3, NOW())",
      [
        adminId || null,
        success ? "LOGIN_SUCCESS" : "LOGIN_FAILED",
        { ip_address: ipAddress },
      ]
    );
  } catch (error) {
    console.error("Failed to log admin login:", error);
  }
}
