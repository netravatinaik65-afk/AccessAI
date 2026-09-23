import apiClient from './api';

const TOKEN_KEY = 'accessai_token';
const USER_KEY = 'accessai_user';

export const authService = {
  /**
   * Register a new user account
   */
  async register({ name, email, password }) {
    const res = await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    if (data.data?.token) {
      authService.setToken(data.data.token);
      authService.setUser(data.data.user);
    }
    return data;
  },

  /**
   * Login with email and password
   */
  async login({ email, password }) {
    const res = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    if (data.data?.token) {
      authService.setToken(data.data.token);
      authService.setUser(data.data.user);
    }
    return data;
  },

  /**
   * Fetch current user profile
   */
  async getMe() {
    const token = authService.getToken();
    if (!token) return null;

    const res = await apiClient('/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      authService.logout();
      return null;
    }

    const data = await res.json();
    return data.data?.user || null;
  },

  /**
   * Fetch full profile including accessibility preferences
   */
  async getProfile() {
    const token = authService.getToken();
    if (!token) return null;

    const res = await apiClient('/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.profile || null;
  },

  /**
   * Update accessibility preferences (fontSize, highContrast, etc.)
   */
  async updateProfile(accessibilityPreferences) {
    const token = authService.getToken();
    if (!token) throw new Error('Not authenticated');

    const res = await apiClient('/profile', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ accessibilityPreferences }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update accessibility preferences');
    }

    if (data.data?.profile) {
      authService.setUser(data.data.profile);
    }
    return data.data?.profile;
  },

  /**
   * Token and User storage helpers
   */
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // storage disabled
    }
  },

  getUser() {
    try {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // storage disabled
    }
  },

  logout() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // storage disabled
    }
  },
};

export default authService;
