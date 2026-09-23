import bcrypt from 'bcrypt';
import userStore from '../services/userStore.js';
import { generateToken } from '../utils/token.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Handle User Registration
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check for duplicate email
    const existingUser = await userStore.findUserByEmail(email);
    if (existingUser) {
      return errorResponse(res, 400, 'An account with this email address already exists');
    }

    // Hash the password with bcrypt
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // Save user to the development store
    const newUser = await userStore.createUser({
      name,
      email,
      passwordHash,
    });

    // Generate JWT token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
    });

    const safeUser = userStore.sanitizeUser(newUser);

    return successResponse(res, 201, 'User registered successfully', {
      user: safeUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle User Login
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Retrieve user by email
    const user = await userStore.findUserByEmail(email);
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    const safeUser = userStore.sanitizeUser(user);

    return successResponse(res, 200, 'Login successful', {
      user: safeUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve Authenticated User Profile
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  return successResponse(res, 200, 'User profile retrieved successfully', {
    user: req.user,
  });
};
