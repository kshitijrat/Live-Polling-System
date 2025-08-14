// models/Poll.js
// Mongoose model for Polls
const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false }
  }],
  answers: [{
    studentName: String,
    optionIndex: Number,
    answeredAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  duration: { type: Number, required: true },
  endedAt: { type: Date }
});

const Poll = mongoose.model('Poll', pollSchema);
module.exports = Poll; 