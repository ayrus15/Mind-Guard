import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, refresh, me } from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('emergencyContacts').optional().isArray().withMessage('Emergency contacts must be an array'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const refreshValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh', refreshValidation, refresh);
router.get('/me', authenticateJWT, me);

export default router;