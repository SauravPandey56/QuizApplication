import express from 'express';
import { startAttempt, submitAttempt, getAttempts } from '../controllers/attemptController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('candidate'), startAttempt)
  .get(protect, getAttempts);

router.route('/:attemptId/submit')
  .post(protect, authorize('candidate'), submitAttempt);

export default router;
