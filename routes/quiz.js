// routes/quiz.js
const express = require("express");
const router = express.Router();
const QuizQuestion = require("../models/quizQuestion");

router.get("/", async (req, res) => {
  const { difficulty, count } = req.query;
  try {
    const questions = await QuizQuestion.aggregate([
      { $match: { difficulty } },
      { $sample: { size: parseInt(count) || 5 } }
    ]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz questions" });
  }
});

module.exports = router;
