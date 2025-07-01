const bcrypt = require("bcryptjs");
const Student = require("../models/student");

// ✅ Public Student Registration (not used currently)
exports.registerStudent = async (req, res) => {
  try {
    const {
      studentName,
      email,
      password,
      parentName,
      parentContactNumber,
      learningDifficulty,
      dateOfBirth,
      registeredBy,
      facialLandmarks
    } = req.body;

    if (!studentName || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      studentName,
      email,
      password: hashedPassword,
      parentName,
      parentContactNumber,
      learningDifficulty: learningDifficulty || [],
      dateOfBirth,
      registeredBy,
      facialLandmarks: facialLandmarks || [],
      createdAt: new Date()
    });

    const savedStudent = await newStudent.save();

    res.status(201).json({ message: "Student registered successfully", student: savedStudent });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Therapist Adds Student with Facial Landmarks
exports.addStudentByTherapist = async (req, res) => {
  try {
    const {
      studentName,
      email,
      password,
      parentName,
      parentContactNumber,
      learningDifficulty,
      dateOfBirth,
      registeredBy,
      facialLandmarks
    } = req.body;

    // Basic validation
    if (!registeredBy) {
      return res.status(400).json({ message: "Therapist ID (registeredBy) is required" });
    }

    if (!studentName || !email || !password) {
      return res.status(400).json({ message: "Student name, email, and password are required" });
    }

    if (!Array.isArray(facialLandmarks) || facialLandmarks.length === 0) {
      return res.status(400).json({ message: "Facial landmarks are required" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      studentName,
      email,
      password: hashedPassword,
      parentName,
      parentContactNumber,
      learningDifficulty: learningDifficulty || [],
      dateOfBirth,
      registeredBy,
      facialLandmarks,
      createdAt: new Date()
    });

    const savedStudent = await student.save();

    // ✅ Send only the student object for frontend
    res.status(201).json({ message: "Student added by therapist", student: savedStudent });
  } catch (error) {
    console.error("Add Student Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Student Login
exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      userId: student._id,
      role: "student"
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get Student Profile by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (err) {
    console.error("Get Student Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get All Students Registered by Therapist
exports.getStudentsByTherapist = async (req, res) => {
  try {
    const therapistId = req.params.therapistId;
    const students = await Student.find({ registeredBy: therapistId }).select("-password");
    res.status(200).json(students);
  } catch (error) {
    console.error("Fetch Students Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete Student by ID
exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findByIdAndDelete(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete Student Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
