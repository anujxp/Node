const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ─── Marks ────────────────────────────────────────────────
    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      enum: ["A+", "A", "B+", "B", "C+", "C", "D", "F"],
    },
    remarks: {
      type: String,
      default: "",
    },
    examType: {
      type: String,
      enum: ["midterm", "final", "assignment", "quiz"],
      default: "final",
    },
  },
  { timestamps: true }
);

// ─── Auto-calculate grade from marks ─────────────────────────
gradeSchema.pre("save", function (next) {
  const m = this.marks;
  if (m >= 90)      this.grade = "A+";
  else if (m >= 80) this.grade = "A";
  else if (m >= 70) this.grade = "B+";
  else if (m >= 60) this.grade = "B";
  else if (m >= 50) this.grade = "C+";
  else if (m >= 40) this.grade = "C";
  else if (m >= 33) this.grade = "D";
  else              this.grade = "F";
  next();
});

module.exports = mongoose.model("Grade", gradeSchema);
