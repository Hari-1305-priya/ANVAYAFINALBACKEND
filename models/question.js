const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  scrambled: { type: String, required: true },
  word: { type: String, required: true },
  type: { type: String, enum: ["quiz", "game"], required: true }, // To distinguish source
});

module.exports = mongoose.model("Question", questionSchema);
