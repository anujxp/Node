const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ─── MIDDLEWARE 1: Verify JWT Token ───────────────────────────
// Protects routes — user must be logged in
const protect = async (req, res, next) => {
  let token;

  // Check Authorization header: "Bearer <token>"
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized. No token." });
  }

  try {
    // Verify token signature + expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach full user object to req
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token is invalid or expired." });
  }
};

// ─── MIDDLEWARE 2: RBAC — Role-Based Access Control ───────────
// Usage: authorize("admin")  or  authorize("admin", "teacher")
// Only users with listed roles can proceed
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not allowed to access this resource.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
