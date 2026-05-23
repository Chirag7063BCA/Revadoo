const mongoose = require('mongoose');

const surveyQuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }]
});

const surveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: "General" },
  thumbnail: { type: String, default: '' },
  reward: { type: Number, required: true },
  questions: [surveyQuestionSchema],
  expiresAt: { type: Date, expires: 0, required: true }, // 👈 Yeh Auto-delete karega
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Survey', surveySchema);