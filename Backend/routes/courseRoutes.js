import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { 
  getCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse, 
  enrollInCourse 
} from '../controllers/CourseController.js';

const router = express.Router();

router.get('/', authenticateToken, getCourses);
router.post('/', authenticateToken, requireRole(['admin']), createCourse);
router.put('/:id', authenticateToken, requireRole(['admin']), updateCourse);
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteCourse);
router.post('/enroll', authenticateToken, requireRole(['employee']), enrollInCourse);

export default router;