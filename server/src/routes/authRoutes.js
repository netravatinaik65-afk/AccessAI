import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';
import validateBody from '../middleware/validate.js';
import requireAuth from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/auth/register
router.post('/register', validateBody(registerSchema), register);

// POST /api/auth/login
router.post('/login', validateBody(loginSchema), login);

// GET /api/auth/me (Protected route)
router.get('/me', requireAuth, getMe);

export default router;
