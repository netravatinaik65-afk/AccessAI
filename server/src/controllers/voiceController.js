import geminiService from '../services/geminiService.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * POST /api/ai/voice
 * Process a voice query through the Gemini AI service
 */
export const processVoiceQuery = async (req, res, next) => {
  try {
    const { speechText, preferredLanguage, context } = req.body;

    const response = await geminiService.processVoiceQuery(
      speechText,
      preferredLanguage || 'English',
      context || ''
    );

    return successResponse(res, 200, 'Voice query processed successfully', {
      response,
    });
  } catch (error) {
    next(error);
  }
};
