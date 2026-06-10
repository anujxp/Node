const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * USER MODEL
 * Roles: admin | teacher | student
 * Each role has different fields and permissions
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Never return password in queries by default
    },

    // ─── RBAC: Role field ─────────────────────────────────────
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },

    // ─── Teacher-specific fields ──────────────────────────────
    subject: {
      type: String, // e.g., "Mathematics", "Computer Science"
    },

    // ─── Student-specific fields ──────────────────────────────
    rollNumber: {
      type: String,
      unique: true,
      sparse: true, // allows null for non-students
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ─── Hash password before saving ─────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ─── Compare password method ──────────────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
