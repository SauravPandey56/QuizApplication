import Quiz from '../models/Quiz.js';

export const getQuizzes = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'examiner') {
      query = { examiner: req.user._id };
    } else if (req.user.role === 'candidate') {
      query = { 
        course: req.user.course, 
        isPublished: true, 
        isActive: true,
        $or: [
          { universityCampus: req.user.universityCampus },
          { universityCampus: { $exists: false } },
          { universityCampus: "" }
        ],
        $or: [
          { branch: req.user.branch },
          { branch: { $exists: false } },
          { branch: "" }
        ],
        $or: [
          { semester: req.user.semester },
          { semester: { $exists: false } }
        ],
        $or: [
          { section: req.user.section },
          { section: { $exists: false } },
          { section: "" }
        ]
      };
    }
    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const quizzes = await Quiz.find(query)
      .populate('course', 'name')
      .populate('examiner', 'name')
      .skip(skip)
      .limit(limit);
      
    const total = await Quiz.countDocuments(query);
    res.json({ quizzes, page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('course', 'name')
      .populate('examiner', 'name');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const { title, description, course, duration, totalMarks, markDistributionType, allowRetake, startTime, endTime, universityCampus, branch, semester, section } = req.body;
    
    const quiz = await Quiz.create({
      title, description, course, examiner: req.user._id, duration, totalMarks, markDistributionType, allowRetake, startTime, endTime, universityCampus, branch, semester, section
    });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    // Only examiner who created can update
    if (quiz.examiner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Lock update for examiner unless permission granted
    if (req.user.role === 'examiner' && quiz.updatePermissionStatus !== 'granted') {
      return res.status(403).json({ message: 'Quiz is locked. Request update permission from admin.' });
    }

    // Reset permission after update
    if (req.user.role === 'examiner') {
      req.body.updatePermissionStatus = 'none';
      req.body.updatePermissionMessage = '';
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    // Auth check
    if (quiz.examiner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify this quiz' });
    }

    quiz.isPublished = !quiz.isPublished;
    const updatedQuiz = await quiz.save();
    
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestUpdatePermission = async (req, res) => {
  try {
    const { message } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    if (quiz.examiner.toString() !== req.user._id.toString()) {
       return res.status(403).json({ message: 'Not authorized' });
    }

    quiz.updatePermissionStatus = 'pending';
    quiz.updatePermissionMessage = message || 'Requesting update permission';
    await quiz.save();

    res.json({ message: 'Update permission requested', quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleUpdatePermission = async (req, res) => {
  try {
    const { status } = req.body; // 'granted' or 'none' (for reject)
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    if (req.user.role !== 'admin') {
       return res.status(403).json({ message: 'Only admin can grant permission' });
    }

    quiz.updatePermissionStatus = status;
    if (status === 'granted') {
       quiz.lastUpdatePermittedBy = req.user._id;
    } else {
       quiz.updatePermissionMessage = '';
    }
    
    await quiz.save();
    res.json({ message: `Update permission ${status}`, quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
