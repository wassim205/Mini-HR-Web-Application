import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { exportEmployees, exportTimeOffRequests } from '../controllers/ExportController.js';

const router = express.Router();

router.get('/employees', authenticateToken, requireRole(['admin']), exportEmployees);
router.get('/timeoff', authenticateToken, requireRole(['admin']), exportTimeOffRequests);

export default router;