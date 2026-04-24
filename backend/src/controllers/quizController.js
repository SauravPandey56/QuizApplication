import Quiz from '../models/Quiz.js';
import ExamDeployment from '../models/ExamDeployment.js';

const getDeploymentState = (deployment) => {
  if (deployment.status === 'ARCHIVED') return 'ARCHIVED';
  
  // If the parent quiz is still DRAFT or REVIEW or APPROVED, we can reflect that
  // Wait, if deployment exists, it has its own status, but frontend expects 'DRAFT', etc.
  if (deployment.quiz.status && ['DRAFT', 'REVIEW', 'APPROVED'].includes(deployment.quiz.status) && !deployment.startTime) {
      if (deployment.quiz.status === 'APPROVED' && !deployment.startTime) return 'APPROVED';
      return deployment.quiz.status; 
  }

  const now = Date.now();
  const startTime = new Date(deployment.startTime).getTime();
  const endTime = deployment.endTime ? new Date(deployment.endTime).getTime() : startTime + (deployment.duration * 60 * 1000);

  if (now >= endTime || deployment.status === 'COMPLETED') return 'COMPLETED';
  if (now >= startTime && now <= endTime) return 'LIVE';
  if (now >= startTime - 10 * 60 * 1000 && now < startTime) return 'UPCOMING';
  if (now >= startTime - 60 * 60 * 1000 && now < startTime - 10 * 60 * 1000) return 'SCHEDULED';
  
  // Fallback to quiz status if deployment is just created
  return deployment.quiz.status || deployment.status;
};

const mapToFrontendQuiz = (deployment) => {
  const now = Date.now();
  const startTime = deployment.startTime ? new Date(deployment.startTime).getTime() : null;
  const endTime = deployment.endTime ? new Date(deployment.endTime).getTime() : (startTime ? startTime + (deployment.duration * 60 * 1000) : null);

  // We merge Quiz and ExamDeployment into a flat "quiz" object for the frontend
  return {
    _id: deployment._id, // Deployment ID becomes the primary identifier
    quizId: deployment.quiz._id, // Real Quiz ID
    title: deployment.quiz.title,
    description: deployment.quiz.description,
    course: deployment.quiz.course,
    examiner: deployment.quiz.examiner,
    totalMarks: deployment.quiz.totalMarks,
    markDistributionType: deployment.quiz.markDistributionType,
    isActive: deployment.quiz.isActive,
    updatePermissionStatus: deployment.quiz.updatePermissionStatus,
    updatePermissionMessage: deployment.quiz.updatePermissionMessage,
    
    // Deployment fields
    duration: deployment.duration,
    startTime: deployment.startTime,
    endTime: endTime ? new Date(endTime).toISOString() : null,
    allowRetake: deployment.allowRetake,
    isPaused: deployment.isPaused,
    broadcastMessage: deployment.broadcastMessage,
    universityCampus: deployment.universityCampus,
    branch: deployment.branch,
    semester: deployment.semester,
    section: deployment.section,
    approvedBy: deployment.approvedBy,
    
    // Calculated state
    status: deployment.quiz.status, // Original quiz status
    state: getDeploymentState(deployment),
    isLive: !!deployment.startTime && deployment.status !== 'ARCHIVED',
    isCompleted: deployment.status === 'COMPLETED' || (startTime && now >= endTime)
  };
};

export const getQuizzes = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'examiner') {
      query = { createdBy: req.user._id };
    } else if (req.user.role === 'candidate') {
      const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
      query = { 
        status: { $in: ['SCHEDULED', 'UPCOMING', 'LIVE', 'COMPLETED'] }, 
        startTime: { $lte: oneHourFromNow }, 
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

    const deployments = await ExamDeployment.find(query)
      .populate({
         path: 'quiz',
         populate: [
            { path: 'course', select: 'name' },
            { path: 'examiner', select: 'name' }
         ]
      })
      .skip(skip)
      .limit(limit)
      .lean();
      
    // Additional filtering for candidates based on Quiz properties (e.g. course match, since course is in Quiz not deployment)
    let filteredDeployments = deployments;
    if (req.user.role === 'candidate') {
        filteredDeployments = deployments.filter(dep => 
            dep.quiz && 
            dep.quiz.course && 
            dep.quiz.course._id.toString() === req.user.course.toString() &&
            dep.quiz.isActive
        );
    }
      
    const formattedQuizzes = filteredDeployments.map(mapToFrontendQuiz);

    // Because of post-filtering, total pagination might be slightly inaccurate for candidates but works for standard UI
    const total = await ExamDeployment.countDocuments(query);
    res.json({ quizzes: formattedQuizzes, page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const deployment = await ExamDeployment.findById(req.params.id)
      .populate({
         path: 'quiz',
         populate: [
            { path: 'course', select: 'name' },
            { path: 'examiner', select: 'name' }
         ]
      })
      .lean();
      
    if (!deployment) return res.status(404).json({ message: 'Exam not found' });
    
    res.json(mapToFrontendQuiz(deployment));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const { title, description, course, duration, totalMarks, markDistributionType, allowRetake, startTime, endTime, universityCampus, branch, semester, section } = req.body;
    
    // 1. Create the Quiz (Question Bank)
    const quiz = await Quiz.create({
      title, description, course, examiner: req.user._id, totalMarks, markDistributionType
    });
    
    // 2. Auto-generate the initial ExamDeployment
    const deployment = await ExamDeployment.create({
      quiz: quiz._id,
      createdBy: req.user._id,
      duration,
      allowRetake,
      startTime,
      endTime,
      universityCampus,
      branch,
      semester,
      section,
      status: 'SCHEDULED'
    });
    
    // Return a combined object purely for the frontend receiver
    const populatedDeployment = await ExamDeployment.findById(deployment._id).populate('quiz');
    res.status(201).json(mapToFrontendQuiz(populatedDeployment));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    // ID here is basically deployment ID
    const deployment = await ExamDeployment.findById(req.params.id);
    if (!deployment) return res.status(404).json({ message: 'Quiz/Deployment not found' });
    
    const quiz = await Quiz.findById(deployment.quiz);
    
    // Only examiner who created can update
    if (quiz.examiner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Lock update for examiner unless permission granted
    if (req.user.role === 'examiner' && quiz.updatePermissionStatus !== 'granted') {
      return res.status(403).json({ message: 'Quiz is locked. Request update permission from admin.' });
    }

    if (req.user.role === 'examiner') {
      quiz.updatePermissionStatus = 'none';
      quiz.updatePermissionMessage = '';
    }

    // Update Quiz fields
    if (req.body.title) quiz.title = req.body.title;
    if (req.body.description !== undefined) quiz.description = req.body.description;
    if (req.body.totalMarks) quiz.totalMarks = req.body.totalMarks;
    if (req.body.markDistributionType) quiz.markDistributionType = req.body.markDistributionType;
    if (req.body.course) quiz.course = req.body.course;
    await quiz.save();
    
    // Update Deployment fields
    if (req.body.duration) deployment.duration = req.body.duration;
    if (req.body.startTime) deployment.startTime = req.body.startTime;
    if (req.body.endTime) deployment.endTime = req.body.endTime;
    if (req.body.allowRetake !== undefined) deployment.allowRetake = req.body.allowRetake;
    if (req.body.universityCampus !== undefined) deployment.universityCampus = req.body.universityCampus;
    if (req.body.branch !== undefined) deployment.branch = req.body.branch;
    if (req.body.semester !== undefined) deployment.semester = req.body.semester;
    if (req.body.section !== undefined) deployment.section = req.body.section;
    await deployment.save();

    const updated = await ExamDeployment.findById(deployment._id).populate('quiz');
    res.json(mapToFrontendQuiz(updated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestUpdatePermission = async (req, res) => {
  try {
    const { message } = req.body;
    const deployment = await ExamDeployment.findById(req.params.id);
    if (!deployment) return res.status(404).json({ message: 'Not found' });
    
    const quiz = await Quiz.findById(deployment.quiz);
    if (quiz.examiner.toString() !== req.user._id.toString()) {
       return res.status(403).json({ message: 'Not authorized' });
    }

    quiz.updatePermissionStatus = 'pending';
    quiz.updatePermissionMessage = message || 'Requesting update permission';
    await quiz.save();

    res.json({ message: 'Update permission requested', quiz: mapToFrontendQuiz(await deployment.populate('quiz')) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleUpdatePermission = async (req, res) => {
  try {
    const { status } = req.body; // 'granted' or 'none' (for reject)
    const deployment = await ExamDeployment.findById(req.params.id);
    const quiz = await Quiz.findById(deployment.quiz);
    
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
    res.json({ message: `Update permission ${status}`, quiz: mapToFrontendQuiz(await deployment.populate('quiz')) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitForReview = async (req, res) => {
  try {
    const deployment = await ExamDeployment.findById(req.params.id);
    const quiz = await Quiz.findById(deployment.quiz);
    
    if (quiz.examiner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    quiz.status = 'REVIEW';
    await quiz.save();
    res.json({ message: 'Submitted for review', quiz: mapToFrontendQuiz(await deployment.populate('quiz')) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveQuiz = async (req, res) => {
  try {
    const deployment = await ExamDeployment.findById(req.params.id);
    const quiz = await Quiz.findById(deployment.quiz);
    
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only admin can approve' });

    quiz.status = 'APPROVED';
    await quiz.save();
    
    deployment.approvedBy = req.user._id;
    await deployment.save();
    
    res.json({ message: 'Quiz approved successfully', quiz: mapToFrontendQuiz(await deployment.populate('quiz')) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const scheduleQuiz = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    const deployment = await ExamDeployment.findById(req.params.id).populate('quiz');
    
    if (req.user.role !== 'admin' && deployment.quiz.examiner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    deployment.startTime = startTime;
    deployment.endTime = endTime;
    deployment.status = 'SCHEDULED';
    await deployment.save();
    res.json({ message: 'Quiz scheduled successfully', quiz: mapToFrontendQuiz(deployment) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postponeQuiz = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    const deployment = await ExamDeployment.findById(req.params.id).populate('quiz');

    deployment.startTime = startTime || deployment.startTime;
    deployment.endTime = endTime || deployment.endTime;
    await deployment.save();
    res.json({ message: 'Quiz postponed successfully', quiz: mapToFrontendQuiz(deployment) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Emergency Controls
export const pauseExam = async (req, res) => {
  try {
    const deployment = await ExamDeployment.findById(req.params.id).populate('quiz');
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

    deployment.isPaused = !deployment.isPaused;
    await deployment.save();
    res.json({ message: `Quiz ${deployment.isPaused ? 'paused' : 'resumed'} successfully`, quiz: mapToFrontendQuiz(deployment) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const extendTime = async (req, res) => {
  try {
    const { extensionMinutes } = req.body;
    const deployment = await ExamDeployment.findById(req.params.id).populate('quiz');
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

    const newEndTime = new Date(new Date(deployment.endTime).getTime() + extensionMinutes * 60000);
    deployment.endTime = newEndTime;
    deployment.duration += extensionMinutes;
    await deployment.save();
    res.json({ message: `Quiz extended by ${extensionMinutes} minutes.`, quiz: mapToFrontendQuiz(deployment) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendBroadcast = async (req, res) => {
  try {
    const { message } = req.body;
    const deployment = await ExamDeployment.findById(req.params.id).populate('quiz');
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

    deployment.broadcastMessage = message;
    await deployment.save();
    res.json({ message: `Broadcast sent successfully: ${message}`, quiz: mapToFrontendQuiz(deployment) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forceSubmit = async (req, res) => {
  try {
    const deployment = await ExamDeployment.findById(req.params.id).populate('quiz');
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

    deployment.status = 'COMPLETED';
    deployment.endTime = Date.now();
    await deployment.save();
    res.json({ message: 'Exam forcefully completed.', quiz: mapToFrontendQuiz(deployment) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const deployment = await ExamDeployment.findById(req.params.id);
    if (!deployment) return res.status(404).json({ message: 'Not found' });
    
    // We optionally delete the quiz here if it's uniquely bound, but to allow reuse we can just delete deployment
    // Or actually since UI currently combines them, if an examiner deletes "quiz", it should delete both
    const quizId = deployment.quiz;
    await deployment.deleteOne();
    await Quiz.findByIdAndDelete(quizId); // simple cleanup
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
