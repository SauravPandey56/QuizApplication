import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswerEncrypted: {
    type: String, // Stored encrypted
    required: true
  },
  marks: {
    type: Number,
    default: 1
    // Used if quiz markDistributionType is 'individual'
  },
  negativeMarks: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
