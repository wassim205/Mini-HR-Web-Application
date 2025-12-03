import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { 
  getEvaluations, 
  assignScore, 
  getEvaluationReport, 
  getUserScores 
} from '../controllers/EvaluationController.js';

const router = express.Router();

router.get('/', authenticateToken, getEvaluations);
router.post('/assign-score', authenticateToken, requireRole(['admin']), assignScore);
router.get('/report', authenticateToken, requireRole(['admin']), getEvaluationReport);
router.get('/my-scores', authenticateToken, requireRole(['employee']), getUserScores);

export default router;