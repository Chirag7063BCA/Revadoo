const express = require("express");
const Attempt = require("../models/Attempt");
const Quiz = require("../models/Quiz");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const router = express.Router();

// POST submit quiz attempt
router.post("/submit", async (req, res) => {
  try {
    const { userId, quizId, userAnswers } = req.body;

    // Get quiz with questions
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Calculate score
    let score = 0;
    const answers = quiz.questions.map((question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) score++;
      return {
        questionIndex: index,
        selectedAnswer: userAnswer,
        isCorrect,
      };
    });

    // Calculate earned coins (score percentage of total reward)
    const totalQuestions = quiz.questions.length;
    const earnedCoins = Math.round((score / totalQuestions) * quiz.reward);

    // Save attempt
    const attempt = new Attempt({
      userId: userId || "anonymous",
      quizId,
      answers,
      score,
      earnedCoins,
    });

    await attempt.save();

    // Update User Wallet if earnedCoins > 0 and userId is provided
    if (earnedCoins > 0 && userId && userId !== "anonymous") {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.creds = (user.creds || 0) + earnedCoins;
          await user.save();

          await Transaction.create({
            userId,
            type: "credit",
            amount: earnedCoins,
            description: `Quiz reward: ${quiz.title}`,
          });
        }
      } catch (walletError) {
        console.error(
          "Failed to update wallet after quiz:",
          walletError.message,
        );
        // We don't fail the whole request since the attempt is already saved
      }
    }

    res.json({
      score,
      totalQuestions,
      earnedCoins,
      answers: attempt.answers,
      quizTitle: quiz.title,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET user quiz statistics
router.get("/user-stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all attempts by user
    const attempts = await Attempt.find({ userId });

    if (!attempts.length) {
      return res.json({
        totalAttempts: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        totalEarned: 0,
      });
    }

    // Calculate statistics
    let totalEarned = 0;
    let totalCorrect = 0;
    let totalWrong = 0;

    attempts.forEach((attempt) => {
      totalEarned += attempt.earnedCoins || 0;
      totalCorrect += attempt.score || 0;
      attempt.answers.forEach((answer) => {
        if (!answer.isCorrect) totalWrong++;
      });
    });

    res.json({
      totalAttempts: attempts.length,
      correctAnswers: totalCorrect,
      wrongAnswers: totalWrong,
      totalEarned: totalEarned,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET admin quiz statistics (all users)
router.get("/admin-stats", async (req, res) => {
  try {
    // Get total quizzes
    const totalQuizzes = await Quiz.countDocuments();

    // Get all attempts
    const allAttempts = await Attempt.find();

    // Calculate statistics
    let totalAttempts = allAttempts.length;
    let totalEarned = 0;

    allAttempts.forEach((attempt) => {
      totalEarned += attempt.earnedCoins || 0;
    });

    res.json({
      totalQuizzes,
      totalAttempts,
      totalEarned,
      totalUsers: new Set(allAttempts.map((a) => a.userId)).size,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
