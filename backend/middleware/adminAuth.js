import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change_me_in_production";

// Rate limiter for admin login attempts (5 attempts per 15 minutes)
export const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip, // Rate limit by IP
});

// Verify admin JWT token
export const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No admin token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired admin token" });
    }
    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    req.admin = admin;
    next();
  });
};

// Generate admin token
export const generateAdminToken = (adminId, email) => {
  return jwt.sign(
    { id: adminId, email, role: "admin" },
    JWT_SECRET,
    { expiresIn: "8h" } // Admin sessions expire after 8 hours
  );
};

// Verify admin password
export const verifyAdminPassword = (providedPassword) => {
  return providedPassword === ADMIN_PASSWORD;
};
