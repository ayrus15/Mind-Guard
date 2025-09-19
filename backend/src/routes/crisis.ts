import { Router } from 'express';
import { body } from 'express-validator';
import { assessCrisisRisk, sendCrisisAlert } from '../controllers/crisisController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Validation rules
const alertValidation = [
  body('riskLevel').isIn(['low', 'medium', 'high']).withMessage('Risk level must be low, medium, or high'),
  body('triggerData').optional().isObject().withMessage('Trigger data must be an object'),
];

// Routes
router.post('/assess', authenticateJWT, assessCrisisRisk);
router.post('/alert', authenticateJWT, alertValidation, sendCrisisAlert);

export default router;