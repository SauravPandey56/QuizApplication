import express from 'express';
import { getSettings, createSetting, deleteSetting } from '../controllers/settingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getSettings)
  .post(protect, authorize('admin'), createSetting);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteSetting);

export default router;
