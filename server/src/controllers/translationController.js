import geminiService from '../services/geminiService.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * POST /api/ai/translate
 * Translate text to a target language using the Gemini AI service
 */
export const translateText = async (req, res, next) => {
  try {
    const { text, sourceText, targetLanguage, sourceLanguage } = req.body;
    const inputText = sourceText || text;

    const result = await geminiService.translateText(
      inputText,
      targetLanguage,
      sourceLanguage || 'Auto'
    );

    return successResponse(res, 200, 'Text translated successfully', {
      translatedText: result.translatedText,
      detectedLanguage: result.detectedLanguage,
      targetLanguage,
    });
  } catch (error) {
    next(error);
  }
};
