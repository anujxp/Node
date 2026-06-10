const Grade = require("../models/Grade");
const Course = require("../models/Course");

// ─── @route  GET /api/grades ──────────────────────────────────
// Admin → all | Teacher → grades they gave | Student → own grades
const getGrades = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "teacher") filter.teacher = req.user._id;
    if (req.user.role === "student") filter.student = req.user._id;

    const grades = await Grade.find(filter)
      .populate("student", "name email rollNumber")
      .populate("course", "name code")
      .populate("teacher", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: grades.length, grades });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  POST /api/grades ─────────────────────────────────
// @access Teacher only — assign grade to a student
const addGrade = async (req, res) => {
  try {
    const { studentId, courseId, marks, examType, remarks } = req.body;

    // Verify teacher teaches this course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only grade your own course." });
    }

    // Verify student is enrolled
    if (!course.students.includes(studentId)) {
      return res.status(400).json({ success: false, message: "Student is not enrolled in this course." });
    }

    // Create or update grade (upsert)
    const grade = await Grade.findOneAndUpdate(
      { student: studentId, course: courseId, examType },
      { student: studentId, course: courseId, teacher: req.user._id, marks, examType, remarks },
      { new: true, upsert: true, runValidators: true }
    );

    const populated = await grade.populate([
      { path: "student", select: "name email rollNumber" },
      { path: "course", select: "name code" },
    ]);

    res.status(201).json({ success: true, grade: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  PUT /api/grades/:id ─────────────────────────────
// @access Teacher only
const updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ success: false, message: "Grade not found." });

    if (grade.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this grade." });
    }

    const updated = await Grade.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("student course teacher", "name email rollNumber code");

    res.json({ success: true, grade: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  DELETE /api/grades/:id ──────────────────────────
// @access Admin only
const deleteGrade = async (req, res) => {
  try {
    await Grade.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Grade deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getGrades, addGrade, updateGrade, deleteGrade };
