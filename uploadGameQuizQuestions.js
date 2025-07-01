const mongoose = require("mongoose");
const fs = require("fs");
const GameQuestion = require("./models/gameQuestion");

// Connect to your MongoDB
mongoose.connect("mongodb://localhost:27017/anvaya", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
    const data = JSON.parse(fs.readFileSync("gameQuestions.json", "utf-8"));

    const formatted = data.map((q) => ({
      word: q.word.toUpperCase(),
      description: q.description,
      difficulty: q.difficulty,
      scrambled: shuffleWord(q.word),
    }));

    await GameQuestion.deleteMany(); // Optional: Clear old questions
    await GameQuestion.insertMany(formatted);

    console.log("✅ Game questions uploaded successfully.");
    process.exit();
  } catch (err) {
    console.error("❌ Error uploading game questions:", err);
    process.exit(1);
  }
}

uploadQuestions();
