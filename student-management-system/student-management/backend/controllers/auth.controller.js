const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ─── Helper: Generate JWT ─────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// ─── @route  POST /api/auth/register ─────────────────────────
// @desc   Register a new user (Admin only in real apps)
// @access Public (for demo)
const register = async (req, res) => {
  try {
    const { name, email, password, role, subject, rollNumber, semester } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    const user = await User.create({
      name, email, password, role,
      ...(role === "teacher" && { subject }),
      ...(role === "student" && { rollNumber, semester }),
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  POST /api/auth/login ─────────────────────────────
// @desc   Login user and return token
// @access Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // select: false on password, so explicitly select it here
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account is deactivated." });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subject: user.subject,
        rollNumber: user.rollNumber,
        semester: user.semester,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  GET /api/auth/me ─────────────────────────────────
// @desc   Get logged-in user's profile
// @access Private
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
