const express = require("express");
const router = express.Router();
const { getGrades, addGrade, updateGrade, deleteGrade } = require("../controllers/grade.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.use(protect);

router.route("/")
  .get(getGrades)                         // All roles see their own grades
  .post(authorize("teacher"), addGrade);  // Only teacher can assign grades

router.route("/:id")
  .put(authorize("teacher"), updateGrade)
  .delete(authorize("admin"), deleteGrade);

module.exports = router;
