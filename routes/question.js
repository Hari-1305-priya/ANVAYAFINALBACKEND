const express = require("express");
const router = express.Router();
const { getGameQuestions, getQuizQuestions } = require("../controllers/questionController");

router.get("/game", getGameQuestions); // e.g. /api/questions/game?difficulty=easy
router.get("/quiz", getQuizQuestions); // e.g. /api/questions/quiz?difficulty=medium

module.exports = router;
