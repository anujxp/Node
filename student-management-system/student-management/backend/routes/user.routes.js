const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// All routes below require: logged in + admin role
router.use(protect);
router.use(authorize("admin"));

router.route("/")
  .get(getAllUsers)    // GET  /api/users?role=student
  .post(createUser);  // POST /api/users

router.route("/:id")
  .get(getUserById)   // GET    /api/users/:id
  .put(updateUser)    // PUT    /api/users/:id
  .delete(deleteUser);// DELETE /api/users/:id

module.exports = router;
