import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import requireAuth from '../middleware/authMiddleware.js';
import validateBody from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/profileValidators.js';

const router = Router();

// GET /api/profile
router.get('/', requireAuth, getProfile);

// PATCH /api/profile
router.patch('/', requireAuth, validateBody(updateProfileSchema), updateProfile);

export default router;
