import express from 'express';
import { getUsers, deleteUser, toggleBlockUser, getGlobalPerformance, updateProfile } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Allowed for all properly authenticated users
router.route('/profile')
  .put(updateProfile);

// STRICTLY Admins only beyond this point
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/performance')
  .get(getGlobalPerformance);

router.route('/:id')
  .delete(deleteUser);

router.route('/:id/toggle-block')
  .put(toggleBlockUser);

export default router;
