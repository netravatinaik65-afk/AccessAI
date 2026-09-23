import { z } from 'zod';

/**
 * Zod Schema for Accessibility Preferences
 */
export const accessibilityPreferencesSchema = z.object({
  fontSize: z
    .enum(['small', 'medium', 'large', 'extra-large', 'extra-extra-large'], {
      errorMap: () => ({ message: 'fontSize must be one of: small, medium, large, extra-large, extra-extra-large' }),
    })
    .optional(),
  highContrast: z.boolean({ invalid_type_error: 'highContrast must be a boolean' }).optional(),
  reducedMotion: z.boolean({ invalid_type_error: 'reducedMotion must be a boolean' }).optional(),
  preferredLanguage: z
    .string({ invalid_type_error: 'preferredLanguage must be a string' })
    .trim()
    .min(2, { message: 'preferredLanguage must be at least 2 characters' })
    .max(50, { message: 'preferredLanguage cannot exceed 50 characters' })
    .optional(),
  voiceEnabled: z.boolean({ invalid_type_error: 'voiceEnabled must be a boolean' }).optional(),
}).strict({
  message: 'Only accessibility preference fields (fontSize, highContrast, reducedMotion, preferredLanguage, voiceEnabled) may be updated',
});

/**
 * Zod Schema for PATCH /api/profile
 * Accepts either { accessibilityPreferences: { ... } } or the preference fields directly
 */
export const updateProfileSchema = z.union([
  z.object({
    accessibilityPreferences: accessibilityPreferencesSchema,
  }),
  accessibilityPreferencesSchema,
]);
