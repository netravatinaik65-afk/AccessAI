import userRepository from '../repositories/userRepository.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * GET /api/profile
 * Retrieve authenticated user profile with accessibility preferences
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await userRepository.findUserById(req.user.id);
    if (!user) {
      return errorResponse(res, 404, 'User profile not found');
    }

    const safeUser = userRepository.sanitizeUser(user);
    return successResponse(res, 200, 'Profile retrieved successfully', {
      profile: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/profile
 * Update accessibility preferences only
 */
export const updateProfile = async (req, res, next) => {
  try {
    // Disallow forbidden core fields if passed directly
    const forbiddenFields = ['id', 'email', 'password_hash', 'passwordHash', 'created_at', 'createdAt'];
    for (const field of forbiddenFields) {
      if (field in req.body) {
        return errorResponse(
          res,
          400,
          `Modifying '${field}' is not permitted. Only accessibility preferences may be updated.`
        );
      }
    }

    // Extract preference payload
    const preferences = req.body.accessibilityPreferences || req.body;

    const updatedUser = await userRepository.updateAccessibilityPreferences(
      req.user.id,
      preferences
    );

    if (!updatedUser) {
      return errorResponse(res, 404, 'User profile not found');
    }

    const safeUser = userRepository.sanitizeUser(updatedUser);
    return successResponse(res, 200, 'Accessibility preferences updated successfully', {
      profile: safeUser,
    });
  } catch (error) {
    next(error);
  }
};
