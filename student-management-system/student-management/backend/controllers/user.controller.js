const User = require("../models/User");

// ─── @route  GET /api/users ───────────────────────────────────
// @access Admin only
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query; // filter by role if provided
    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  GET /api/users/:id ───────────────────────────────
// @access Admin only
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  POST /api/users ──────────────────────────────────
// @access Admin only
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, subject, rollNumber, semester } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "Email already exists." });

    const user = await User.create({
      name, email, password, role,
      ...(role === "teacher" && { subject }),
      ...(role === "student" && { rollNumber, semester }),
    });

    res.status(201).json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  PUT /api/users/:id ───────────────────────────────
// @access Admin only
const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body; // Don't allow password change here
    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  DELETE /api/users/:id ───────────────────────────
// @access Admin only
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "Cannot delete your own account." });
    }

    await user.deleteOne();
    res.json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
