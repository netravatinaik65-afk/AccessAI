/**
 * AccessAI API Service Client
 * 
 * Foundation for connecting to the Node.js / Express backend later.
 * Authentication tokens and API routes will be wired here in subsequent phases.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://accessai-backend.onrender.com/api';

export const apiClient = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return response;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

export default apiClient;
