import { verifyToken } from '../utils/token.js';
import userStore from '../services/userStore.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Authentication Middleware
 * Validates incoming Bearer token and attaches authenticated user to req.user
 */
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'Authentication token missing. Expected format: Bearer <token>');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return errorResponse(res, 401, 'Authentication token missing');
  }

  try {
    const decoded = verifyToken(token);

    // Look up the user record
    const user = await userStore.findUserById(decoded.id);

    if (!user) {
      return errorResponse(res, 401, 'User associated with this token no longer exists');
    }

    // Attach sanitized user information to request
    req.user = userStore.sanitizeUser(user);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Authentication token has expired. Please sign in again.');
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid authentication token');
    }
    return errorResponse(res, 401, 'Authentication failed');
  }
};

export default requireAuth;
