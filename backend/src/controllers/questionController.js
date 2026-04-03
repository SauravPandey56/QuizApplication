import Question from '../models/Question.js';
import Quiz from '../models/Quiz.js';
import { encrypt } from '../utils/encryption.js';

export const addQuestion = async (req, res) => {
  try {
    const { text, options, correctAnswer, marks, negativeMarks } = req.body;
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    if (quiz.examiner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Encrypt the correct answer
    const correctAnswerEncrypted = encrypt(correctAnswer.toString());

    const question = await Question.create({
      quiz: quizId,
      text,
      options,
      correctAnswerEncrypted,
      marks: quiz.markDistributionType === 'individual' ? marks : 1,
      negativeMarks: negativeMarks || 0
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestionsForQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    
    // If the user is a candidate, they shouldn't see correctAnswerEncrypted at all
    let selectString = '';
    if (req.user.role === 'candidate') {
      selectString = '-correctAnswerEncrypted';
    }

    const questions = await Question.find({ quiz: quizId }).select(selectString);
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
