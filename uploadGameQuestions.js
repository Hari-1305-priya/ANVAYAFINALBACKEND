const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const GameQuestion = require("./models/gameQuestion");

function shuffleWord(word) {
  const arr = word.toUpperCase().split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

async function uploadQuestions() {
  try {
    const filePath = path.join(__dirname, "utils", "gameQuestions.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const formatted = data.map((q) => ({
      word: q.word.toUpperCase(),
      description: q.description,
      difficulty: q.difficulty,
      scrambled: shuffleWord(q.word),
    }));

    await GameQuestion.deleteMany();
    await GameQuestion.insertMany(formatted);

    console.log("✅ Game questions uploaded successfully.");
    process.exit();
  } catch (err) {
    console.error("❌ Error uploading game questions:", err);
    process.exit(1);
  }
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    uploadQuestions();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
