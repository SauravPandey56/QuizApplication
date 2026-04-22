import ExamSession from '../models/ExamSession.js';
import ExamDeployment from '../models/ExamDeployment.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import { decrypt } from '../utils/encryption.js';

export const startAttempt = async (req, res) => {
  try {
    const { quizId } = req.body; 
    // Wait, the frontend sends `{ quizId }`, which actually contains our deployment ID now.
    const deploymentId = quizId;
    
    const deployment = await ExamDeployment.findById(deploymentId).populate('quiz');
    
    if (!deployment || !deployment.quiz.isActive) return res.status(404).json({ message: 'Exam not found or inactive' });

    const existingSession = await ExamSession.findOne({ candidate: req.user._id, examDeployment: deploymentId });
    if (existingSession && !deployment.allowRetake) {
      return res.status(400).json({ message: 'Retake not allowed for this exam' });
    }

    const session = await ExamSession.create({
      candidate: req.user._id,
      examDeployment: deploymentId,
      status: 'in_progress'
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params; // The frontend route uses :attemptId
    const { responses } = req.body; // Array of { questionId, selectedOption }

    const session = await ExamSession.findById(attemptId);
    if (!session || session.status === 'submitted' || session.status === 'auto_submitted') {
      return res.status(400).json({ message: 'Attempt not found or already completed' });
    }

    if (session.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const deployment = await ExamDeployment.findById(session.examDeployment).populate('quiz');
    const quiz = deployment.quiz;
    const questions = await Question.find({ quiz: quiz._id });

    let score = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalNegativeMarks = 0;
    
    const processedResponses = [];

    // Evaluate answers
    for (const response of responses) {
      const q = questions.find(question => question._id.toString() === response.questionId.toString());
      if (!q) continue;

      const correctAnswerIdStr = decrypt(q.correctAnswerEncrypted);
      const isAttempted = response.selectedOption !== null && response.selectedOption !== undefined && response.selectedOption !== '';
      const isCorrect = isAttempted && (response.selectedOption.toString() === correctAnswerIdStr);
      
      let marksAwarded = 0;
      if (isCorrect) {
        marksAwarded = quiz.markDistributionType === 'equal' 
          ? (quiz.totalMarks / questions.length) 
          : q.marks;
          
        score += marksAwarded;
        totalCorrect++;
      } else if (isAttempted) {
        marksAwarded = -q.negativeMarks;
        score += marksAwarded;
        totalNegativeMarks += q.negativeMarks;
        totalIncorrect++;
      }

      processedResponses.push({
        question: q._id,
        selectedOption: response.selectedOption,
        isCorrect,
        marksAwarded
      });
    }

    session.responses = processedResponses;
    session.score = score;
    session.totalCorrect = totalCorrect;
    session.totalIncorrect = totalIncorrect;
    session.totalNegativeMarks = totalNegativeMarks;
    session.status = 'submitted';
    session.endTime = Date.now();

    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttempts = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'candidate') {
      query.candidate = req.user._id;
    }
    
    const sessions = await ExamSession.find(query)
      .populate({
         path: 'examDeployment',
         populate: { path: 'quiz', select: 'title totalMarks course' }
      })
      .populate('candidate', 'name email');
      
    // Because the frontend UI relies on the field `quiz` being populated directly on the attempt object, we map it internally
    const mappedSessions = sessions.map(session => {
       const raw = session.toObject();
       if (raw.examDeployment) {
         raw.quiz = {
            ...raw.examDeployment.quiz,
            startTime: raw.examDeployment.startTime,
            duration: raw.examDeployment.duration
         };
         delete raw.examDeployment;
       }
       // Note: status is now 'submitted' but frontend looks for 'completed'
       if (raw.status === 'submitted' || raw.status === 'auto_submitted') {
         raw.status = 'completed';
       }
       if (raw.status === 'in_progress') {
         raw.status = 'in-progress';
       }
       return raw;
    });

    res.json(mappedSessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    // Only fetch submitted attempts
    const sessions = await ExamSession.find({ status: { $in: ['submitted', 'auto_submitted'] } })
      .populate({
         path: 'examDeployment',
         populate: { path: 'quiz', select: 'title course' }
      })
      .populate('candidate', 'name universityCampus branch semester section')
      .sort({ score: -1, endTime: 1 })
      .limit(100);
      
    const validSessions = sessions.filter(s => s.candidate && s.examDeployment && s.examDeployment.quiz);
    
    const mappedLeaderboard = validSessions.map(a => ({
      _id: a._id,
      score: a.score,
      quizTitle: a.examDeployment.quiz.title,
      candidateName: a.candidate.name,
      campus: a.candidate.universityCampus || 'Standard',
      branch: a.candidate.branch || 'General',
      semester: a.candidate.semester || 'N/A'
    }));

    res.json(mappedLeaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
