import express from 'express';
import { startAttempt, submitAttempt, getAttempts, getLeaderboard } from '../controllers/attemptController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// The Leaderboard needs to be evaluated BEFORE passing /:attemptId to avoid 'leaderboard' being caught as an attempt id
router.route('/leaderboard')
  .get(protect, getLeaderboard);

router.route('/')
  .post(protect, authorize('candidate'), startAttempt)
  .get(protect, getAttempts);

router.route('/:attemptId/submit')
  .post(protect, authorize('candidate'), submitAttempt);

export default router;
