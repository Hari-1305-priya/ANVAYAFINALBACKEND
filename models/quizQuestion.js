const mongoose = require("mongoose");

const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String], // Changed from [Number] to [String] for greater flexibility
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 2;
      },
      message: "At least two options are required"
    }
  },
  answer: {
    type: String, // Changed from Number to String to match `options` type
    required: true
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true
  },
  operation: {
    type: String, // optional field like 'addition', 'subtraction'
    enum: ["addition", "subtraction", "multiplication", "division", "mixed"],
    default: "mixed"
  }
}, { timestamps: true });

module.exports = mongoose.model("QuizQuestion", quizQuestionSchema);
