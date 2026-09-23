import jwt from 'jsonwebtoken';
import config from '../config/env.js';

/**
 * Generate a signed JWT token
 * @param {object} payload 
 * @returns {string}
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

/**
 * Verify and decode a JWT token
 * @param {string} token 
 * @returns {object}
 */
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
