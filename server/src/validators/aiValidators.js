import { z } from 'zod';

/**
 * Zod Schema for POST /api/ai/simplify
 */
export const simplifySchema = z.object({
  text: z
    .string({ required_error: 'Text to simplify is required' })
    .trim()
    .min(1, { message: 'Text cannot be empty' })
    .max(25000, { message: 'Text exceeds maximum allowed length of 25,000 characters' }),
});

/**
 * Zod Schema for POST /api/ai/ask
 */
export const askSchema = z.object({
  context: z
    .string({ required_error: 'Context information is required' })
    .trim()
    .min(1, { message: 'Context cannot be empty' })
    .max(35000, { message: 'Context exceeds maximum allowed length of 35,000 characters' }),
  question: z
    .string({ required_error: 'Question is required' })
    .trim()
    .min(1, { message: 'Question cannot be empty' })
    .max(1500, { message: 'Question exceeds maximum allowed length of 1,500 characters' }),
});

/**
 * Supported image MIME types for visual accessibility analysis
 */
export const SUPPORTED_IMAGE_MIMES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

/**
 * Zod Schema for Base64 Image Payload (when not using multipart/form-data)
 */
export const imageBase64Schema = z.object({
  imageBase64: z
    .string({ required_error: 'Image data is required' })
    .min(10, { message: 'Valid image base64 data is required' }),
  mimeType: z
    .string({ required_error: 'MIME type is required' })
    .refine((mime) => SUPPORTED_IMAGE_MIMES.includes(mime.toLowerCase()), {
      message: `Unsupported image type. Allowed formats: ${SUPPORTED_IMAGE_MIMES.join(', ')}`,
    }),
});

/**
 * Zod Schema for POST /api/ai/voice
 */
export const voiceQuerySchema = z.object({
  speechText: z
    .string({ required_error: 'Speech text is required' })
    .trim()
    .min(1, { message: 'Speech text cannot be empty' })
    .max(10000, { message: 'Speech text exceeds maximum allowed length of 10,000 characters' }),
  preferredLanguage: z
    .string({ invalid_type_error: 'preferredLanguage must be a string' })
    .trim()
    .max(50, { message: 'preferredLanguage cannot exceed 50 characters' })
    .optional(),
  context: z
    .string({ invalid_type_error: 'context must be a string' })
    .trim()
    .max(25000, { message: 'Context cannot exceed 25,000 characters' })
    .optional(),
});

/**
 * Supported languages for translation
 */
export const SUPPORTED_LANGUAGES = [
  'English',
  'Kannada',
  'Hindi',
];

/**
 * Zod Schema for POST /api/ai/translate
 */
export const translateSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, { message: 'Text cannot be empty' })
    .max(25000, { message: 'Text exceeds maximum allowed length of 25,000 characters' })
    .optional(),
  sourceText: z
    .string()
    .trim()
    .min(1, { message: 'Text cannot be empty' })
    .max(25000, { message: 'Text exceeds maximum allowed length of 25,000 characters' })
    .optional(),
  targetLanguage: z
    .string({ required_error: 'Target language is required' })
    .trim()
    .min(1, { message: 'Target language cannot be empty' })
    .max(50, { message: 'Target language name cannot exceed 50 characters' }),
  sourceLanguage: z
    .string({ invalid_type_error: 'sourceLanguage must be a string' })
    .trim()
    .max(50, { message: 'Source language name cannot exceed 50 characters' })
    .optional(),
}).refine((data) => Boolean((data.text && data.text.length > 0) || (data.sourceText && data.sourceText.length > 0)), {
  message: 'Text to translate is required',
  path: ['text'],
});

