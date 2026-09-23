/**
 * Controller for API health check and identification
 */

export const getHealth = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'AccessAI API is running',
  });
};

export const getApiRoot = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'AccessAI — Personal AI Accessibility Copilot API',
    version: '1.0.0',
    documentation: '/api/health',
  });
};
