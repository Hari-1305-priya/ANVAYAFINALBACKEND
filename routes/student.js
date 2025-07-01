const express = require("express");
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  getStudentById,
  addStudentByTherapist,
  getStudentsByTherapist,
  deleteStudent
} = require("../controllers/studentController");

// Public Student registration
router.post("/register", registerStudent);

// Student login
router.post("/login", loginStudent);

// Get student profile by ID
router.get("/:id", getStudentById);

// ✅ Therapist adds student
router.post("/add", addStudentByTherapist);

// ✅ Therapist fetches all their students
router.get("/therapist/:therapistId", getStudentsByTherapist);

// ✅ Therapist deletes student by ID
router.delete("/:id", deleteStudent);

module.exports = router;

