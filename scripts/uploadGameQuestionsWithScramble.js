const fs = require("fs");
const mongoose = require("mongoose");
const GameQuestion = require("../models/gameQuestion");
require("dotenv").config();

const scrambleWord = (word) => {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
};

const upload = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const raw = fs.readFileSync("./utils/gameQuestions.json");
    const questions = JSON.parse(raw);

    const withScrambled = questions.map((q) => ({
      ...q,
      scrambled: scrambleWord(q.word),
    }));

    await GameQuestion.deleteMany();
    await GameQuestion.insertMany(withScrambled);

    console.log("✅ Game questions with scrambled words uploaded successfully.");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

upload();
