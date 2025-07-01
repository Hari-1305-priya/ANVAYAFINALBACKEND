const mongoose = require("mongoose");

const gameQuestionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  scrambled: { type: String, required: true },
  word: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true }
});

module.exports = mongoose.model("GameQuestion", gameQuestionSchema);
