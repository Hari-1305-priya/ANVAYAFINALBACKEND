const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const QuizQuestion = require("../models/quizQuestion");

dotenv.config();

const filePath = path.join(__dirname, "../utils/testQuizQuestions.json");

async function uploadTestQuizQuestions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Load raw data
    const rawData = fs.readFileSync(filePath);
    const parsed = JSON.parse(rawData);

    // Transform to match schema: flatten and rename correctAnswer ➜ answer
    const quizData = parsed.questions.map(q => ({
      question: q.question,
      options: q.options,
      answer: q.correctAnswer,
      difficulty: q.difficulty,
      operation: q.operation || "", // Optional if your schema accepts it
    }));

    // Optional: avoid duplicates (clear or check before insert)
    const countBefore = await QuizQuestion.countDocuments();
    await QuizQuestion.insertMany(quizData);
    const countAfter = await QuizQuestion.countDocuments();

    console.log(`✅ Uploaded ${countAfter - countBefore} new quiz questions.`);
    process.exit();
  } catch (err) {
    console.error("❌ Error uploading test quiz questions:", err.message);
    process.exit(1);
  }
}

uploadTestQuizQuestions();
