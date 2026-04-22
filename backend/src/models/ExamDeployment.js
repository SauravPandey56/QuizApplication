import mongoose from 'mongoose';

const examDeploymentSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  allowRetake: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'UPCOMING', 'LIVE', 'COMPLETED', 'ARCHIVED'],
    default: 'SCHEDULED'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPaused: {
    type: Boolean,
    default: false
  },
  broadcastMessage: {
    type: String,
    default: ''
  },
  // Targeting fields
  universityCampus: { type: String, trim: true },
  branch: { type: String, trim: true },
  semester: { type: Number, min: 1, max: 8 },
  section: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.model('ExamDeployment', examDeploymentSchema);
