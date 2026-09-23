import { errorResponse } from '../utils/apiResponse.js';

/**
 * 404 Not Found Middleware for unmatched API routes
 */
export const notFoundHandler = (req, res) => {
  return errorResponse(res, 404, `API route not found: ${req.method} ${req.originalUrl}`);
};

export default notFoundHandler;
