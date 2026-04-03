import express from 'express';
import { addQuestion, getQuestionsForQuiz } from '../controllers/questionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true }); // Important to access quizId from parent router

router.route('/')
  .post(protect, authorize('examiner', 'admin'), addQuestion)
  .get(protect, getQuestionsForQuiz);

export default router;
