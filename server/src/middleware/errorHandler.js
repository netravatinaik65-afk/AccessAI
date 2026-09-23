import { ZodError } from 'zod';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, _next) => {
  // Handle JSON parse syntax errors (e.g. malformed body in POST/PUT)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return errorResponse(res, 400, 'Malformed JSON payload provided');
  }

  // Handle Zod schema validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return errorResponse(res, 400, 'Validation failed', formattedErrors);
  }

  // Handle Multer upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 400, 'Uploaded image exceeds maximum size limit of 5MB');
    }
    return errorResponse(res, 400, `Upload error: ${err.message}`);
  }

  // Handle explicit bad request / client errors
  if (err.status === 400) {
    return errorResponse(res, 400, err.message);
  }

  // Handle AI service errors (502 Bad Gateway / 503 Service Unavailable)
  if (err.status === 502 || err.status === 503) {
    return errorResponse(res, err.status, err.message);
  }

  // General server error
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  return errorResponse(res, statusCode, message);
};

export default errorHandler;
