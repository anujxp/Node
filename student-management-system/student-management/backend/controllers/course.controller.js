const Course = require("../models/Course");

// ─── @route  GET /api/courses ─────────────────────────────────
// Admin → all courses | Teacher → own courses | Student → enrolled courses
const getCourses = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "teacher") {
      filter.teacher = req.user._id;
    } else if (req.user.role === "student") {
      filter.students = req.user._id;
    }
    // admin sees all (no filter)

    const courses = await Course.find(filter)
      .populate("teacher", "name email subject")
      .populate("students", "name email rollNumber semester")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  GET /api/courses/:id ────────────────────────────
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacher", "name email subject")
      .populate("students", "name email rollNumber semester");

    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  POST /api/courses ───────────────────────────────
// @access Admin only
const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  PUT /api/courses/:id ────────────────────────────
// @access Admin only
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  DELETE /api/courses/:id ─────────────────────────
// @access Admin only
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    res.json({ success: true, message: "Course deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── @route  POST /api/courses/:id/enroll ────────────────────
// @access Admin | Teacher
const enrollStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });

    if (course.students.includes(studentId)) {
      return res.status(400).json({ success: false, message: "Student already enrolled." });
    }

    course.students.push(studentId);
    await course.save();
    res.json({ success: true, message: "Student enrolled successfully.", course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, enrollStudent };
