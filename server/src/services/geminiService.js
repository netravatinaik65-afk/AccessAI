import { GoogleGenAI } from '@google/genai';
import config from '../config/env.js';

/**
 * AccessAI Gemini Service
 * 
 * Secure backend service interface for Google Gemini API.
 * All API keys are isolated exclusively to the server environment.
 */

export const isGeminiConfigured = () => {
  return Boolean(config.geminiApiKey && config.geminiApiKey.trim().length > 0);
};

const getGenAIClient = () => {
  if (!isGeminiConfigured()) {
    const error = new Error('Gemini AI service is currently unavailable. Please configure the AI service credentials.');
    error.status = 503;
    error.isConfigError = true;
    throw error;
  }

  return new GoogleGenAI({ apiKey: config.geminiApiKey });
};

const FALLBACK_MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash'];

const mapGeminiError = (error, defaultMessage) => {
  if (error.isConfigError) return error;
  const isRateLimit =
    error.status === 429 ||
    (error.message &&
      (error.message.includes('429') ||
        error.message.includes('quota') ||
        error.message.includes('RESOURCE_EXHAUSTED')));
  const isServiceUnavailable =
    error.status === 503 ||
    (error.message && (error.message.includes('503') || error.message.includes('UNAVAILABLE')));

  if (isRateLimit) {
    const rateLimitError = new Error(
      'AI service rate limit reached. Please wait a moment and try again.'
    );
    rateLimitError.status = 429;
    return rateLimitError;
  }

  if (isServiceUnavailable) {
    const serviceError = new Error(
      'AI service is temporarily unavailable. Please try again in a few moments.'
    );
    serviceError.status = 503;
    return serviceError;
  }

  const genericError = new Error(defaultMessage);
  genericError.status = 502;
  return genericError;
};

const generateWithFallback = async (ai, payload) => {
  const modelsToTry = [config.geminiModel, ...FALLBACK_MODELS.filter(m => m !== config.geminiModel)];
  let lastError;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        ...payload,
        model: modelName,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err) {
      lastError = err;
      const isTransient = err.status === 429 || err.status === 503 || (err.message && (err.message.includes('429') || err.message.includes('503') || err.message.includes('quota') || err.message.includes('RESOURCE_EXHAUSTED') || err.message.includes('UNAVAILABLE')));
      if (isTransient) {
        console.warn(`[Gemini Service] Model ${modelName} transient error (${err.status || 'rate limit'}). Trying fallback model...`);
        continue;
      }
      throw err;
    }
  }

  throw lastError;
};

export const geminiService = {
  /**
   * Simplify complex text for cognitive and reading accessibility
   * @param {string} text - The input text to simplify
   * @returns {Promise<string>}
   */
  async simplifyText(text) {
    const ai = getGenAIClient();
    const prompt = `You are an AI Accessibility Assistant designed to help people with diverse cognitive, visual, and learning needs access information clearly.

Task: Simplify the following text into plain, easily understandable language.

Guidelines:
- Explain the content in simple, straightforward language.
- Preserve all important facts, instructions, dates, numbers, names, and requirements accurately.
- Do NOT change, omit, or invent any dates, numbers, names, or requirements.
- Use short, readable paragraphs and clean bullet points where appropriate.
- Avoid unnecessary jargon, acronyms, or complex technical terms.

Text to simplify:
${text}`;

    try {
      const response = await generateWithFallback(ai, {
        contents: prompt,
      });

      if (!response || !response.text) {
        throw new Error('Gemini API returned an empty response');
      }

      return response.text.trim();
    } catch (error) {
      console.error('[Gemini Service Error in simplifyText]:', error.message || error);
      throw mapGeminiError(error, 'Failed to generate simplified text from AI service.');
    }
  },

  /**
   * Answer user questions based strictly and solely on provided context
   * @param {string} context - The source document or text
   * @param {string} question - The user's question
   * @returns {Promise<string>}
   */
  async answerQuestion(context, question) {
    const ai = getGenAIClient();
    const prompt = `You are an AI Accessibility Copilot helping a user understand a provided document or information source.

Task: Answer the user's question based strictly and solely on the provided context below.

Rules:
- Answer ONLY using the information explicitly supplied in the context.
- If the answer cannot be found in the provided context, clearly state: "The requested information is not available in the supplied content."
- Do NOT hallucinate, assume, or invent details not present in the context.
- Keep your answer direct, clear, and easy to read.

Context:
${context}

Question:
${question}`;

    try {
      const response = await generateWithFallback(ai, {
        contents: prompt,
      });

      if (!response || !response.text) {
        throw new Error('Gemini API returned an empty response');
      }

      return response.text.trim();
    } catch (error) {
      console.error('[Gemini Service Error in answerQuestion]:', error.message || error);
      throw mapGeminiError(error, 'Failed to retrieve answer from AI service.');
    }
  },

  /**
   * Analyze an image to provide visual description and text extraction (OCR)
   * @param {Buffer|string} imageData - Binary buffer or base64 image string
   * @param {string} mimeType - Supported image mime type
   * @returns {Promise<string>}
   */
  async analyzeImage(imageData, mimeType = 'image/jpeg') {
    const ai = getGenAIClient();
    const base64Data = Buffer.isBuffer(imageData) ? imageData.toString('base64') : imageData;

    const prompt = `You are an AI Accessibility Visual Assistant helping blind, low-vision, and visually impaired users.

Task: Provide a detailed, accessible analysis of this image.

Guidelines:
- Describe the overall scene and image clearly and concisely.
- Identify key visible objects, visual elements, people, colors, and layout.
- Extract any visible text (OCR) accurately word-for-word.
- Explain the visual information in clear, simple language.
- Preserve important dates, numbers, names, prices, or instructions found within the image.`;

    try {
      const response = await generateWithFallback(ai, {
        contents: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          prompt,
        ],
      });

      if (!response || !response.text) {
        throw new Error('Gemini API returned an empty response');
      }

      return response.text.trim();
    } catch (error) {
      console.error('[Gemini Service Error in analyzeImage]:', error.message || error);
      throw mapGeminiError(error, 'Failed to analyze image with AI service.');
    }
  },

  /**
   * Process spoken voice query with language and accessibility awareness
   * @param {string} speechText - Recognized speech text
   * @param {string} [preferredLanguage='English'] - User's preferred language (e.g. English, Kannada, Hindi)
   * @param {string} [context=''] - Optional context
   * @returns {Promise<string>}
   */
  async processVoiceQuery(speechText, preferredLanguage = 'English', context = '') {
    const ai = getGenAIClient();
    const prompt = `You are AccessAI Voice Copilot, an assistive accessibility companion designed to help people understand digital and visual information through conversational voice interaction.

User's spoken query:
"${speechText}"

${context ? `Relevant context provided by user:\n${context}\n` : ''}

Instructions:
- Provide an accessible, direct, and helpful response to the user's spoken question.
- Format the response so it is easy to listen to when read aloud by Text-to-Speech (TTS).
- Answer in the user's preferred language: ${preferredLanguage}. (Supported languages include English, Kannada, Hindi).
- Avoid complex nested lists or special punctuation symbols that sound awkward when spoken aloud.
- Keep the response concise, informative, and empathetic.`;

    try {
      const response = await generateWithFallback(ai, {
        contents: prompt,
      });

      if (!response || !response.text) {
        throw new Error('Gemini API returned an empty response');
      }

      return response.text.trim();
    } catch (error) {
      console.error('[Gemini Service Error in processVoiceQuery]:', error.message || error);
      throw mapGeminiError(error, 'Failed to process voice query with AI service.');
    }
  },

  /**
   * Translate text from one language to another with accessibility awareness
   * @param {string} text - The text to translate
   * @param {string} targetLanguage - The target language (e.g. 'Kannada', 'Hindi', 'English')
   * @param {string} [sourceLanguage='Auto'] - The source language or 'Auto' for auto-detection
   * @returns {Promise<{translatedText: string, detectedLanguage: string}>}
   */
  async translateText(text, targetLanguage, sourceLanguage = 'Auto') {
    const ai = getGenAIClient();
    const sourceInstruction = sourceLanguage === 'Auto'
      ? 'Auto-detect the source language.'
      : `The source language is: ${sourceLanguage}.`;

    const prompt = `You are an AI Accessibility Translation Assistant helping people access information in their preferred language.

Task: Translate the following text into ${targetLanguage}.

${sourceInstruction}

Rules:
- Translate the text accurately and naturally into ${targetLanguage}.
- Preserve all important facts, dates, numbers, names, and instructions.
- Use clear, simple language appropriate for accessibility.
- Do NOT add explanations, commentary, or notes — return ONLY the translated text.
- If the source and target languages are the same, return the original text unchanged.
- Respond in this exact JSON format:
{"translatedText": "<translated text here>", "detectedLanguage": "<detected source language name>"}

Text to translate:
${text}`;

    try {
      const response = await generateWithFallback(ai, {
        contents: prompt,
      });

      if (!response || !response.text) {
        throw new Error('Gemini API returned an empty response');
      }

      // Parse JSON response from Gemini
      const rawText = response.text.trim();
      try {
        // Try to extract JSON from the response (Gemini may wrap in markdown code blocks)
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            translatedText: parsed.translatedText || rawText,
            detectedLanguage: parsed.detectedLanguage || (sourceLanguage !== 'Auto' ? sourceLanguage : 'Unknown'),
          };
        }
      } catch {
        // If JSON parsing fails, return the raw text as translation
      }

      return {
        translatedText: rawText,
        detectedLanguage: sourceLanguage !== 'Auto' ? sourceLanguage : 'Unknown',
      };
    } catch (error) {
      console.error('[Gemini Service Error in translateText]:', error.message || error);
      throw mapGeminiError(error, 'Failed to translate text with AI service.');
    }
  },
};

export default geminiService;
