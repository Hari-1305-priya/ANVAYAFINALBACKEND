const Question = require("../models/question");

// GET /api/questions/:type
exports.getQuestionsByType = async (req, res) => {
  try {
    const { type } = req.params;

    // Optional: Validate 'type' input to avoid invalid queries
    const validTypes = ["quiz", "game"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid question type" });
    }

    const questions = await Question.find({ type }).lean(); // lean() returns plain JS objects, slightly faster
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions." });
  }
};

// POST /api/questions/bulk (Admin/testing only)
exports.addBulkQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Questions array is required" });
    }

    // Optional: validate question fields before insert (example)
    // For example, check if each question has 'question' and 'options' fields

    await Question.insertMany(questions);
    res.status(201).json({ message: "Questions added successfully" });
  } catch (error) {
    console.error("Error adding questions:", error);
    res.status(500).json({ error: "Failed to add questions." });
  }
};
