import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { 
  createTimeOffRequest, 
  getUserTimeOffRequests, 
  getAllTimeOffRequests, 
  updateTimeOffStatus 
} from '../controllers/TimeOffController.js';

const router = express.Router();

router.post('/', authenticateToken, requireRole(['employee']), createTimeOffRequest);
router.get('/my-requests', authenticateToken, requireRole(['employee']), getUserTimeOffRequests);
router.get('/all', authenticateToken, requireRole(['admin']), getAllTimeOffRequests);
router.put('/:id/status', authenticateToken, requireRole(['admin']), updateTimeOffStatus);

export default router;