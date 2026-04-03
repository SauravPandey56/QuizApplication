import express from 'express';
import { createQuiz, getQuizzes, getQuizById, togglePublish, updateQuiz } from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';
import questionRoutes from './questionRoutes.js';

const router = express.Router();

// Nest question routes inside quiz routes
router.use('/:quizId/questions', questionRoutes);

router.route('/')
  .get(protect, getQuizzes)
  .post(protect, authorize('examiner', 'admin'), createQuiz);

router.route('/:id')
  .get(getQuizById)
  .put(protect, authorize('examiner', 'admin'), updateQuiz);

router.route('/:id/publish')
  .put(protect, authorize('examiner', 'admin'), togglePublish);

export default router;
