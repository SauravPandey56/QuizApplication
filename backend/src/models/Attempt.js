import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  selectedOption: {
    type: Number
  },
  isCorrect: {
    type: Boolean
  },
  marksAwarded: {
    type: Number,
    default: 0
  }
}, { _id: false });

const attemptSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  score: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  responses: [responseSchema],
  totalCorrect: { type: Number, default: 0 },
  totalIncorrect: { type: Number, default: 0 },
  totalNegativeMarks: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Attempt', attemptSchema);
