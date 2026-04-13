import Attempt from '../models/Attempt.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import { decrypt } from '../utils/encryption.js';

export const startAttempt = async (req, res) => {
  try {
    const { quizId } = req.body;
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz || !quiz.isActive) return res.status(404).json({ message: 'Quiz not found or inactive' });

    const existingAttempt = await Attempt.findOne({ candidate: req.user._id, quiz: quizId });
    if (existingAttempt && !quiz.allowRetake) {
      return res.status(400).json({ message: 'Retake not allowed for this quiz' });
    }

    const attempt = await Attempt.create({
      candidate: req.user._id,
      quiz: quizId,
      status: 'in-progress'
    });

    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { responses } = req.body; // Array of { questionId, selectedOption }

    const attempt = await Attempt.findById(attemptId);
    if (!attempt || attempt.status === 'completed') {
      return res.status(400).json({ message: 'Attempt not found or already completed' });
    }

    if (attempt.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const quiz = await Quiz.findById(attempt.quiz);
    const questions = await Question.find({ quiz: attempt.quiz });

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
      // check if a valid selection was made
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

    attempt.responses = processedResponses;
    attempt.score = score;
    attempt.totalCorrect = totalCorrect;
    attempt.totalIncorrect = totalIncorrect;
    attempt.totalNegativeMarks = totalNegativeMarks;
    attempt.status = 'completed';
    attempt.endTime = Date.now();

    await attempt.save();

    res.json(attempt);
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
    const attempts = await Attempt.find(query)
      .populate('quiz', 'title totalMarks course startTime duration')
      .populate('candidate', 'name email');
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    // Only fetch completed attempts
    const attempts = await Attempt.find({ status: 'completed' })
      .populate('quiz', 'title course')
      .populate('candidate', 'name universityCampus branch semester section')
      .sort({ score: -1, endTime: 1 }) // Sort highest score first, then earliest finish time
      .limit(100); // Only return top 100 for performance
      
    // Filter out null candidates/quizzes in case of database orphans
    const validAttempts = attempts.filter(a => a.candidate && a.quiz);
    
    // We strictly map this to avoid leaking passwords or sensitive hash maps that may exist
    const mappedLeaderboard = validAttempts.map(a => ({
      _id: a._id,
      score: a.score,
      quizTitle: a.quiz.title,
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
