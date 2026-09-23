import { Router } from 'express';
import { getHealth, getApiRoot } from '../controllers/healthController.js';

const router = Router();

// GET /api
router.get('/', getApiRoot);

// GET /api/health
router.get('/health', getHealth);

export default router;
