import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  examiner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  markDistributionType: {
    type: String,
    enum: ['equal', 'individual'],
    default: 'equal' // If equal, totalMarks / number of questions
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'REVIEW', 'APPROVED'],
    default: 'DRAFT'
  },
  
  // Update permission fields
  updatePermissionStatus: {
    type: String,
    enum: ['none', 'pending', 'granted'],
    default: 'none'
  },
  updatePermissionMessage: { type: String, trim: true },
  lastUpdatePermittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
