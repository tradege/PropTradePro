import axios from 'axios';

const API_BASE_URL = '/api/v1';

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
  getAll: (params) => api.get('/programs/', { params }),
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



// Profile API
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  changePassword: (data) => api.put('/profile/password', data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteAvatar: () => api.delete('/profile/avatar'),
  getStats: () => api.get('/profile/stats'),
};

// Admin API
export const adminAPI = {
  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleUserStatus: (id) => api.post(`/admin/users/${id}/toggle-status`),
  
  // Programs
  getPrograms: (params) => api.get('/admin/programs', { params }),
  createProgram: (data) => api.post('/admin/programs', data),
  updateProgram: (id, data) => api.put(`/admin/programs/${id}`, data),
  deleteProgram: (id) => api.delete(`/admin/programs/${id}`),
  
  // Payments
  getPayments: (params) => api.get('/admin/payments', { params }),
  getPayment: (id) => api.get(`/admin/payments/${id}`),
  refundPayment: (id, data) => api.post(`/admin/payments/${id}/refund`, data),
  exportPayments: (params) => api.get('/admin/payments/export', { params, responseType: 'blob' }),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
  
  // Statistics
  getStats: () => api.get('/admin/stats'),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
};

// KYC API
export const kycAPI = {
  getDocuments: () => api.get('/kyc/documents'),
  uploadDocument: (file, documentType) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/kyc/documents/${documentType}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getPendingDocuments: () => api.get('/kyc/pending'),
  approveDocument: (id, notes) => api.post(`/kyc/${id}/approve`, { notes }),
  rejectDocument: (id, reason) => api.post(`/kyc/${id}/reject`, { reason }),
  getDocument: (id) => api.get(`/kyc/${id}`),
  deleteDocument: (id) => api.delete(`/kyc/${id}`),
};

// Challenges API
export const challengesAPI = {
  getMyChallenges: () => api.get('/challenges/my-challenges'),
  getChallenge: (id) => api.get(`/challenges/${id}`),
  createChallenge: (data) => api.post('/challenges', data),
  evaluateChallenge: (id) => api.post(`/challenges/${id}/evaluate`),
  fundAccount: (id, data) => api.post(`/challenges/${id}/fund`, data),
  getTrades: (id, params) => api.get(`/challenges/${id}/trades`, { params }),
  addTrade: (id, data) => api.post(`/challenges/${id}/trades`, data),
  getStatistics: (id) => api.get(`/challenges/${id}/statistics`),
};

// Traders API
export const tradersAPI = {
  getDashboard: () => api.get('/traders/dashboard'),
  getTradingHistory: (params) => api.get('/traders/trading-history', { params }),
  getWithdrawals: () => api.get('/traders/withdrawals'),
  requestWithdrawal: (data) => api.post('/traders/withdrawals', data),
  getDocuments: () => api.get('/traders/documents'),
  uploadDocument: (file, documentType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    return api.post('/traders/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Agents API
export const agentsAPI = {
  getAgents: (params) => api.get('/agents', { params }),
  getAgent: (id) => api.get(`/agents/${id}`),
  getTraders: (agentId) => api.get(`/agents/${agentId}/traders`),
  getCommissions: (agentId, params) => api.get(`/agents/${agentId}/commissions`, { params }),
  requestPayout: (data) => api.post('/agents/payout-request', data),
  getPayouts: () => api.get('/agents/payouts'),
};

// Reports API
export const reportsAPI = {
  getAgentStats: () => api.get('/reports/agent-stats'),
  getMonthlyTrends: (params) => api.get('/reports/monthly-trends', { params }),
  getTopPerformers: (params) => api.get('/reports/top-performers', { params }),
  getAdminAnalytics: (params) => api.get('/reports/admin-analytics', { params }),
  exportReport: (type, params) => api.get(`/reports/export/${type}`, { params, responseType: 'blob' }),
};

// Hierarchy API
export const hierarchyAPI = {
  getMyDownline: () => api.get('/hierarchy/my-downline'),
  getMyDirectTeam: (params) => api.get('/hierarchy/my-direct-team', { params }),
  createUser: (data) => api.post('/hierarchy/create-user', data),
  getUser: (id) => api.get(`/hierarchy/user/${id}`),
  updateUser: (id, data) => api.put(`/hierarchy/user/${id}`, data),
  getTree: (params) => api.get('/hierarchy/tree', { params }),
  getStats: () => api.get('/hierarchy/stats'),
};

// CRM API
export const crmAPI = {
  // Leads
  getLeads: (params) => api.get('/crm/leads', { params }),
  getLead: (id) => api.get(`/crm/leads/${id}`),
  createLead: (data) => api.post('/crm/leads', data),
  updateLead: (id, data) => api.put(`/crm/leads/${id}`, data),
  
  // Activities
  addActivity: (leadId, data) => api.post(`/crm/leads/${leadId}/activities`, data),
  
  // Notes
  addNote: (leadId, data) => api.post(`/crm/leads/${leadId}/notes`, data),
  
  // Conversion
  convertLead: (leadId, data) => api.post(`/crm/leads/${leadId}/convert`, data),
  markLost: (leadId, data) => api.post(`/crm/leads/${leadId}/lost`, data),
  
  // Analytics
  getStats: () => api.get('/crm/stats'),
  getPipeline: () => api.get('/crm/pipeline'),
};

// Helper function for error handling
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
    return {
      success: false,
      message,
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      success: false,
      message: 'No response from server. Please check your connection.',
      status: 0,
    };
  } else {
    // Error in request setup
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      status: 0,
    };
  }
};

