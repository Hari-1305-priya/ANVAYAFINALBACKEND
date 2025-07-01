const GameQuestion = require("../models/gameQuestion");
const QuizQuestion = require("../models/quizQuestion");

exports.getGameQuestions = async (req, res) => {
  try {
    const { difficulty } = req.query;

    let questions;
    if (difficulty) {
      // If difficulty is explicitly passed, filter
      questions = await GameQuestion.find({ difficulty });
    } else {
      // If no difficulty is passed, return a mix of all
      questions = await GameQuestion.find({});
    }

    if (!questions.length) {
      return res.status(404).json({ message: "No game questions found." });
    }

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching game questions", error: err.message });
  }
};

exports.getQuizQuestions = async (req, res) => {
  try {
    const { difficulty } = req.query;

    let questions;
    if (difficulty) {
      questions = await QuizQuestion.find({ difficulty });
    } else {
      questions = await QuizQuestion.find({});
    }

    if (!questions.length) {
      return res.status(404).json({ message: "No quiz questions found." });
    }

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching quiz questions", error: err.message });
  }
};
