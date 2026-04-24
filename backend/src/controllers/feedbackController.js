import Feedback from '../models/Feedback.js';

export const submitFeedback = async (req, res) => {
  console.log("Feedback API hit:", req.body);
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const feedback = await Feedback.create({ name, email, subject, message });
    res.status(201).json({ message: 'Thank you! Your feedback has been sent to the admin.', feedback });
  } catch (error) {
    console.error("Feedback creation error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    
    feedback.isRead = true;
    await feedback.save();
    res.json({ message: 'Feedback marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnreadFeedbackCount = async (req, res) => {
  try {
    const count = await Feedback.countDocuments({ isRead: false });
    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
