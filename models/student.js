const mongoose = require("mongoose");

const landmarkSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  z: { type: Number, required: true },
}, { _id: false });

const studentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  parentName: { type: String },
  parentContactNumber: { type: String },
  learningDifficulty: [{ type: String }],
  dateOfBirth: { type: Date },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "Therapist" },
  facialLandmarks: [landmarkSchema], // ✅ New field for landmark storage
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Student", studentSchema);
