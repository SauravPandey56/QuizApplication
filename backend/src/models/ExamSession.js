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

const examSessionSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examDeployment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamDeployment',
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
    enum: ['not_started', 'in_progress', 'submitted', 'auto_submitted'],
    default: 'in_progress'
  },
  responses: [responseSchema],
  totalCorrect: { type: Number, default: 0 },
  totalIncorrect: { type: Number, default: 0 },
  totalNegativeMarks: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('ExamSession', examSessionSchema);
