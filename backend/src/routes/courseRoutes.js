import express from 'express';
import { getCourses, createCourse, deactivateCourse } from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, authorize('admin', 'examiner'), createCourse); // Examiner allowed to dynamically add courses

router.route('/:id')
  .delete(protect, authorize('admin'), deactivateCourse);

export default router;
