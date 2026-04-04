import User from '../models/User.js';
import Attempt from '../models/Attempt.js';
import bcrypt from 'bcryptjs';

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    if (req.body.profileImage !== undefined) user.profileImage = req.body.profileImage;
    if (req.body.contactNumber !== undefined) user.contactNumber = req.body.contactNumber;
    if (req.body.dob !== undefined) user.dob = req.body.dob;
    if (req.body.address !== undefined) user.address = req.body.address;
    if (req.body.fatherName !== undefined) user.fatherName = req.body.fatherName;
    if (req.body.universityCampus !== undefined) user.universityCampus = req.body.universityCampus;
    if (req.body.branch !== undefined) user.branch = req.body.branch;
    if (req.body.semester !== undefined) user.semester = req.body.semester;
    if (req.body.section !== undefined) user.section = req.body.section;
    
    if (req.body.password) {
      if (req.body.password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      course: updatedUser.course,
      profileImage: updatedUser.profileImage,
      contactNumber: updatedUser.contactNumber,
      dob: updatedUser.dob,
      address: updatedUser.address,
      fatherName: updatedUser.fatherName,
      universityCampus: updatedUser.universityCampus,
      branch: updatedUser.branch,
      semester: updatedUser.semester,
      section: updatedUser.section
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).populate('course', 'name');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User completely deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'unblocked' : 'blocked'} successfully`, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGlobalPerformance = async (req, res) => {
  try {
    const attempts = await Attempt.find({ status: 'completed' })
      .populate({
        path: 'candidate',
        select: 'name email universityCampus branch semester section course',
        populate: { path: 'course', select: 'name' }
      })
      .populate({
        path: 'quiz',
        select: 'title totalMarks course universityCampus branch semester section',
        populate: { path: 'course', select: 'name' }
      });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role, course, universityCampus, branch, semester, section } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, password: hashedPassword, role, course, universityCampus, branch, semester, section
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
