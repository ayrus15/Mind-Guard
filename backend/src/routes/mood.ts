import { Router } from 'express';
import { body } from 'express-validator';
import { createMoodEntry, getMoodHistory } from '../controllers/moodController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Validation rules
const moodEntryValidation = [
  body('moodScore').isInt({ min: 1, max: 10 }).withMessage('Mood score must be between 1 and 10'),
  body('text').optional().isString().withMessage('Text must be a string'),
];

// Routes
router.post('/', authenticateJWT, moodEntryValidation, createMoodEntry);
router.get('/history', authenticateJWT, getMoodHistory);

export default router;