import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we have a refresh token, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  login2FA: (data) => api.post('/auth/login/2fa', data),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  requestPasswordReset: (email) => api.post('/auth/password/reset-request', { email }),
  resetPassword: (data) => api.post('/auth/password/reset', data),
  enable2FA: () => api.post('/auth/2fa/enable'),
  confirm2FA: (token) => api.post('/auth/2fa/confirm', { token }),
  disable2FA: (password) => api.post('/auth/2fa/disable', { password }),
  getCurrentUser: () => api.get('/auth/me'),
};

// Programs API
export const programsAPI = {
  getAll: (params) => api.get('/programs', { params }),
  getById: (id) => api.get(`/programs/${id}`),
  create: (data) => api.post('/programs', data),
  update: (id, data) => api.put(`/programs/${id}`, data),
  purchase: (id, data) => api.post(`/programs/${id}/purchase`, data),
  getMyChallenges: () => api.get('/programs/my-challenges'),
  getChallenge: (id) => api.get(`/programs/challenges/${id}`),
  createAddon: (programId, data) => api.post(`/programs/${programId}/addons`, data),
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: (challengeId) => api.post('/payments/create-payment-intent', { challenge_id: challengeId }),
  confirmPayment: (paymentIntentId) => api.post('/payments/confirm-payment', { payment_intent_id: paymentIntentId }),
  refund: (challengeId, reason) => api.post(`/payments/refund/${challengeId}`, { reason }),
  getPaymentStatus: (paymentIntentId) => api.get(`/payments/status/${paymentIntentId}`),
};

// Uploads API
export const uploadsAPI = {
  uploadKYC: (file, documentType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    return api.post('/uploads/kyc', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/uploads/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadTenantLogo: (file, tenantId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenant_id', tenantId);
    return api.post('/uploads/tenant-logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;

