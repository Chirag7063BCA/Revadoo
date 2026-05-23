const express = require("express");
const Quiz = require("../models/Quiz");
const router = express.Router();

// GET all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find().select(
      "title description reward thumbnail questions",
    );
    // Transform to include question count
    const formattedQuizzes = quizzes.map((quiz) => ({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      reward: quiz.reward,
      thumbnail: quiz.thumbnail,
      questionCount: quiz.questions ? quiz.questions.length : 0,
      questions: quiz.questions, // Include full questions for reference
    }));
    res.json(formattedQuizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single quiz with questions
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new quiz (admin)
router.post("/", async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE remove a quiz (admin)
router.delete("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ message: "Quiz deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
