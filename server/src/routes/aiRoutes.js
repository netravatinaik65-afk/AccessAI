import { Router } from 'express';
import { simplifyText, askAccessAI, analyzeImage } from '../controllers/aiController.js';
import { processVoiceQuery } from '../controllers/voiceController.js';
import { translateText } from '../controllers/translationController.js';
import requireAuth from '../middleware/authMiddleware.js';
import validateBody from '../middleware/validate.js';
import uploadImage from '../middleware/upload.js';
import { simplifySchema, askSchema, voiceQuerySchema, translateSchema } from '../validators/aiValidators.js';

const router = Router();

// POST /api/ai/simplify
router.post('/simplify', requireAuth, validateBody(simplifySchema), simplifyText);

// POST /api/ai/ask
router.post('/ask', requireAuth, validateBody(askSchema), askAccessAI);

// POST /api/ai/image (supports multipart upload via field 'image' or base64 JSON)
router.post('/image', requireAuth, (req, res, next) => {
  // If content-type is multipart/form-data, use multer; otherwise proceed to controller
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    uploadImage.single('image')(req, res, next);
  } else {
    next();
  }
}, analyzeImage);

// POST /api/ai/voice
router.post('/voice', requireAuth, validateBody(voiceQuerySchema), processVoiceQuery);

// POST /api/ai/translate
router.post('/translate', requireAuth, validateBody(translateSchema), translateText);

export default router;
