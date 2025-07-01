const fs = require("fs");

// Step 1: Read original JSON
const raw = fs.readFileSync("./utils/testQuizQuestions.json");
const originalData = JSON.parse(raw);

// Step 2: Extract the array and transform each object
const fixedQuestions = originalData.questions.map(q => ({
  question: q.question,
  options: q.options,
  answer: q.correctAnswer,
  difficulty: q.difficulty,
  operation: q.operation || "",  // Optional: include if schema supports
}));

// Step 3: Save to new file
fs.writeFileSync(
  "./utils/fixedTestQuizQuestions.json",
  JSON.stringify(fixedQuestions, null, 2)
);

console.log("✅ Fixed quiz data saved to fixedTestQuizQuestions.json");
