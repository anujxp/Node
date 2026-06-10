const express = require("express");
const router = express.Router();
const {
  getCourses, getCourseById, createCourse, updateCourse, deleteCourse, enrollStudent,
} = require("../controllers/course.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.use(protect); // All routes need login

router.route("/")
  .get(getCourses)                          // All roles can see their courses
  .post(authorize("admin"), createCourse);  // Only admin creates

router.route("/:id")
  .get(getCourseById)
  .put(authorize("admin"), updateCourse)
  .delete(authorize("admin"), deleteCourse);

// Enroll a student into a course
router.post("/:id/enroll", authorize("admin", "teacher"), enrollStudent);

module.exports = router;
