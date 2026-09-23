import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import aiRoutes from './aiRoutes.js';

const router = Router();

// Mount health and root routes
router.use('/', healthRoutes);

// Mount authentication routes
router.use('/auth', authRoutes);

// Mount user profile routes
router.use('/profile', profileRoutes);

// Mount Gemini AI routes
router.use('/ai', aiRoutes);

export default router;
