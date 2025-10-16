import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Initialize auth state from localStorage
  init: async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await authAPI.getCurrentUser();
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  // Login
  login: async (email, password) => {
    try {
      set({ error: null });
      const response = await authAPI.login({ email, password });

      // Check if 2FA is required
      if (response.data.requires_2fa) {
        return { requires2FA: true, userId: response.data.user_id };
      }

      // Save tokens
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);

      set({
        user: response.data.user,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Login with 2FA
  login2FA: async (userId, token) => {
    try {
      set({ error: null });
      const response = await authAPI.login2FA({ user_id: userId, token });

      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);

      set({
        user: response.data.user,
        isAuthenticated: true,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || '2FA verification failed';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Register
  register: async (data) => {
    try {
      set({ error: null });
      const response = await authAPI.register(data);
      return { success: true, user: response.data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Logout
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  // Update user
  updateUser: (userData) => {
    set({ user: userData });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;

