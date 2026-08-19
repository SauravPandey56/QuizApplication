import ExamDeployment from '../models/ExamDeployment.js';
import ExamSession from '../models/ExamSession.js';
import Question from '../models/Question.js';
import { decrypt } from '../utils/encryption.js';
import { getDeploymentWindowState, isCandidateEligible } from '../utils/examEligibility.js';

const getDeploymentWithQuiz = (deploymentId) => ExamDeployment.findById(deploymentId).populate({
  path: 'quiz',
  populate: { path: 'course', select: 'name' }
});

export const startAttempt = async (req, res) => {
  try {
    const deploymentId = req.body.deploymentId || req.body.quizId;
    if (!deploymentId) return res.status(400).json({ message: 'deploymentId is required' });

    const deployment = await getDeploymentWithQuiz(deploymentId);
    if (!deployment || !deployment.quiz?.isActive) {
      return res.status(404).json({ message: 'Exam not found or inactive' });
    }

    if (!isCandidateEligible(deployment, req.user)) {
      return res.status(403).json({ message: 'You are not eligible for this exam' });
    }

    const windowState = getDeploymentWindowState(deployment);
    if (windowState !== 'LIVE') {
      return res.status(400).json({ message: `Exam is currently ${windowState.toLowerCase()}` });
    }

    const attemptCount = await ExamSession.countDocuments({
      candidate: req.user._id,
      examDeployment: deployment._id
    });
    const maxAttempts = deployment.maxAttempts || (deployment.allowRetake ? 2 : 1);
    if (attemptCount >= maxAttempts) {
      return res.status(400).json({ message: 'Maximum attempts reached for this exam' });
    }

    const activeSession = await ExamSession.findOne({
      candidate: req.user._id,
      examDeployment: deployment._id,
      status: 'in_progress'
    });
    if (activeSession) return res.status(409).json(activeSession);

    const session = await ExamSession.create({
      candidate: req.user._id,
      examDeployment: deployment._id,
      status: 'in_progress'
    });

    res.status(201).json({
      ...session.toObject(),
      deploymentId: deployment._id,
      quizId: deployment.quiz._id
    });
  } catch (error) {
    console.error('Start attempt error:', error);
    res.status(500).json({ message: 'Unable to start exam' });
  }
};

export const submitAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { responses } = req.body;
    if (!Array.isArray(responses)) return res.status(400).json({ message: 'responses must be an array' });

    const session = await ExamSession.findById(attemptId);
    if (!session || ['submitted', 'auto_submitted'].includes(session.status)) {
      return res.status(400).json({ message: 'Attempt not found or already completed' });
    }
    if (session.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const deployment = await getDeploymentWithQuiz(session.examDeployment);
    if (!deployment?.quiz) return res.status(404).json({ message: 'Exam not found' });

    const questions = await Question.find({ quiz: deployment.quiz._id });
    const questionMap = new Map(questions.map((question) => [question._id.toString(), question]));
    const submittedQuestionIds = new Set();
    const now = Date.now();
    const sessionDeadline = new Date(session.startTime).getTime() + (deployment.duration * 60 * 1000);
    const deploymentDeadline = deployment.endTime ? new Date(deployment.endTime).getTime() : null;
    const isLate = now > sessionDeadline || (deploymentDeadline && now > deploymentDeadline);

    let score = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalNegativeMarks = 0;
    const processedResponses = [];

    for (const response of responses) {
      if (!response?.questionId || submittedQuestionIds.has(String(response.questionId))) {
        return res.status(400).json({ message: 'Responses must contain unique question IDs' });
      }
      submittedQuestionIds.add(String(response.questionId));

      const question = questionMap.get(String(response.questionId));
      if (!question) return res.status(400).json({ message: 'Response contains a question outside this exam' });

      const selectedOption = response.selectedOption === null || response.selectedOption === undefined
        ? ''
        : String(response.selectedOption);
      const correctAnswer = decrypt(question.correctAnswerEncrypted);
      const isAttempted = selectedOption !== '';
      const isCorrect = isAttempted && selectedOption === correctAnswer;
      let marksAwarded = 0;

      if (isCorrect) {
        marksAwarded = deployment.quiz.markDistributionType === 'equal'
          ? (deployment.quiz.totalMarks / Math.max(questions.length, 1))
          : question.marks;
        score += marksAwarded;
        totalCorrect += 1;
      } else if (isAttempted) {
        marksAwarded = -question.negativeMarks;
        score += marksAwarded;
        totalNegativeMarks += question.negativeMarks;
        totalIncorrect += 1;
      }

      processedResponses.push({
        question: question._id,
        selectedOption,
        isCorrect,
        marksAwarded
      });
    }

    session.responses = processedResponses;
    session.score = score;
    session.totalCorrect = totalCorrect;
    session.totalIncorrect = totalIncorrect;
    session.totalNegativeMarks = totalNegativeMarks;
    session.status = isLate ? 'auto_submitted' : 'submitted';
    session.endTime = new Date();
    await session.save();

    res.json(session);
  } catch (error) {
    console.error('Submit attempt error:', error);
    res.status(500).json({ message: 'Unable to evaluate exam submission' });
  }
};

export const getAttempts = async (req, res) => {
  try {
    const query = req.user.role === 'candidate' ? { candidate: req.user._id } : {};
    const sessions = await ExamSession.find(query)
      .populate({
        path: 'examDeployment',
        populate: { path: 'quiz', select: 'title totalMarks course duration' }
      })
      .populate('candidate', 'name email');

    const mappedSessions = sessions.map((session) => {
      const raw = session.toObject();
      const deployment = raw.examDeployment;
      const quiz = deployment?.quiz;
      if (deployment && quiz) {
        raw.deploymentId = deployment._id;
        raw.quizId = quiz._id;
        raw.quiz = {
          ...quiz,
          startTime: deployment.startTime,
          duration: deployment.duration,
          deploymentId: deployment._id,
          quizId: quiz._id,
          isPaused: deployment.isPaused
        };
        delete raw.examDeployment;
      }
      raw.sessionStatus = raw.status;
      if (raw.status === 'submitted' || raw.status === 'auto_submitted') raw.status = 'completed';
      if (raw.status === 'in_progress') raw.status = 'in-progress';
      return raw;
    });

    res.json(mappedSessions);
  } catch (error) {
    console.error('Get attempts error:', error);
    res.status(500).json({ message: 'Unable to load attempts' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const sessions = await ExamSession.find({ status: { $in: ['submitted', 'auto_submitted'] } })
      .populate({ path: 'examDeployment', populate: { path: 'quiz', select: 'title course' } })
      .populate('candidate', 'name universityCampus branch semester section')
      .sort({ score: -1, endTime: 1 })
      .limit(100);

    const mappedLeaderboard = sessions
      .filter((session) => session.candidate && session.examDeployment?.quiz)
      .map((session) => ({
        _id: session._id,
        score: session.score,
        quizTitle: session.examDeployment.quiz.title,
        candidateName: session.candidate.name,
        campus: session.candidate.universityCampus || 'Standard',
        branch: session.candidate.branch || 'General',
        semester: session.candidate.semester || 'N/A'
      }));

    res.json(mappedLeaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Unable to load leaderboard' });
  }
};
