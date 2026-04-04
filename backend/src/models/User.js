import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'examiner', 'candidate'],
    default: 'candidate'
  },
  profileImage: { type: String, default: '' },
  contactNumber: { type: String, default: '' },
  dob: { type: Date },
  address: { type: String, default: '' },
  fatherName: { type: String, default: '' },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: function() {
      return this.role === 'candidate';
    }
  },
  universityCampus: {
    type: String,
    trim: true
  },
  branch: {
    type: String,
    trim: true
  },
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  section: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
