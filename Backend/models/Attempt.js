const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // You can integrate with auth later
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  answers: [{
    questionIndex: Number,
    selectedAnswer: String,
    isCorrect: Boolean
  }],
  score: { type: Number, default: 0 },
  earnedCoins: { type: Number, default: 0 },
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attempt', attemptSchema);