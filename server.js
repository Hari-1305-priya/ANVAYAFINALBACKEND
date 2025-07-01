// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit the app if DB connection fails
  });

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Route Imports
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/student");
const therapistRoutes = require("./routes/therapist");
const questionRoutes = require("./routes/question"); // <- make sure this file exists!
const quizRoutes = require("./routes/quiz");


// ✅ Route Mounts
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/therapist", therapistRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/quiz", quizRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🎯 ALP Backend Running");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
