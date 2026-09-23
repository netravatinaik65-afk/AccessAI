import geminiService from '../services/geminiService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { imageBase64Schema, SUPPORTED_IMAGE_MIMES } from '../validators/aiValidators.js';

/**
 * POST /api/ai/simplify
 * Simplify complex text into accessible plain language
 */
export const simplifyText = async (req, res, next) => {
  try {
    const { text } = req.body;
    const simplifiedText = await geminiService.simplifyText(text);

    return successResponse(res, 200, 'Text simplified successfully', {
      simplifiedText,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/ai/ask
 * Answer accessibility questions strictly from provided context
 */
export const askAccessAI = async (req, res, next) => {
  try {
    const { context, question } = req.body;
    const answer = await geminiService.answerQuestion(context, question);

    return successResponse(res, 200, 'Answer generated successfully', {
      answer,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/ai/image
 * Analyze image and extract visual details and embedded text
 */
export const analyzeImage = async (req, res, next) => {
  try {
    let imageData;
    let mimeType;

    // Check if uploaded as multipart file
    if (req.file) {
      imageData = req.file.buffer;
      mimeType = req.file.mimetype;
    } else if (req.body && req.body.imageBase64) {
      // Check if uploaded as base64 payload in JSON
      const parsed = imageBase64Schema.parse(req.body);
      imageData = parsed.imageBase64;
      mimeType = parsed.mimeType;
    } else {
      return errorResponse(
        res,
        400,
        'No image provided. Please upload an image file (multipart) or provide imageBase64 with mimeType in JSON.'
      );
    }

    // Validate MIME type
    if (!SUPPORTED_IMAGE_MIMES.includes(mimeType.toLowerCase())) {
      return errorResponse(
        res,
        400,
        `Unsupported image type: ${mimeType}. Allowed formats: ${SUPPORTED_IMAGE_MIMES.join(', ')}`
      );
    }

    const analysis = await geminiService.analyzeImage(imageData, mimeType);

    return successResponse(res, 200, 'Image analyzed successfully', {
      analysis,
    });
  } catch (error) {
    next(error);
  }
};
