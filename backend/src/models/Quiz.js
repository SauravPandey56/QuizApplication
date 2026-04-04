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
  totalMarks: {
    type: Number,
    required: true
  },
  markDistributionType: {
    type: String,
    enum: ['equal', 'individual'],
    default: 'equal' // If equal, totalMarks / number of questions
  },
  allowRetake: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  // Targeting fields
  universityCampus: { type: String, trim: true },
  branch: { type: String, trim: true },
  semester: { type: Number, min: 1, max: 8 },
  section: { type: String, trim: true },
  
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
