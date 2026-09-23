import apiClient from './api';
import authService from './authService';

/**
 * AccessAI Frontend AI Service Client
 * Connects frontend modules to the secure backend Gemini API endpoints.
 */
export const aiService = {
  /**
   * Simplify complex text
   * @param {string} text
   * @returns {Promise<string>}
   */
  async simplifyText(text) {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required. Please sign in.');

    const res = await apiClient('/ai/simplify', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to simplify text');
    }

    return data.data?.simplifiedText;
  },

  /**
   * Ask AccessAI questions strictly based on context
   * @param {string} context
   * @param {string} question
   * @returns {Promise<string>}
   */
  async askAccessAI(context, question) {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required. Please sign in.');

    const res = await apiClient('/ai/ask', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ context, question }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to retrieve answer');
    }

    return data.data?.answer;
  },

  /**
   * Analyze image for visual descriptions and text extraction
   * @param {File|string} fileOrBase64
   * @param {string} [mimeType='image/jpeg']
   * @returns {Promise<string>}
   */
  async analyzeImage(fileOrBase64, mimeType = 'image/jpeg') {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required. Please sign in.');

    let res;
    if (typeof fileOrBase64 === 'string') {
      // Base64 JSON payload
      res = await apiClient('/ai/image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageBase64: fileOrBase64,
          mimeType,
        }),
      });
    } else {
      // Multipart FormData payload
      const formData = new FormData();
      formData.append('image', fileOrBase64);

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://accessai-backend.onrender.com/api';
      res = await fetch(`${API_BASE_URL}/ai/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to analyze image');
    }

    return data.data?.analysis;
  },

  /**
   * Send a voice query (speech text) to the AI backend
   * @param {string} speechText - The recognized speech text
   * @param {string} [preferredLanguage='English'] - User's preferred language
   * @param {string} [context=''] - Optional context
   * @returns {Promise<string>}
   */
  async voiceQuery(speechText, preferredLanguage = 'English', context = '') {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required. Please sign in.');

    const res = await apiClient('/ai/voice', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ speechText, preferredLanguage, context }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to process voice query');
    }

    return data.data?.response;
  },

  /**
   * Translate text to a target language
   * @param {string} text - The text to translate
   * @param {string} targetLanguage - Target language name
   * @param {string} [sourceLanguage] - Optional source language (defaults to auto-detect)
   * @returns {Promise<{translatedText: string, detectedLanguage: string, targetLanguage: string}>}
   */
  async translateText(text, targetLanguage, sourceLanguage) {
    const token = authService.getToken();
    if (!token) throw new Error('Authentication required. Please sign in.');

    const payload = { text, sourceText: text, targetLanguage };
    if (sourceLanguage && sourceLanguage !== 'Auto') {
      payload.sourceLanguage = sourceLanguage;
    }

    const res = await apiClient('/ai/translate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to translate text');
    }

    return {
      translatedText: data.data?.translatedText,
      detectedLanguage: data.data?.detectedLanguage,
      targetLanguage: data.data?.targetLanguage,
    };
  },
};

export default aiService;
