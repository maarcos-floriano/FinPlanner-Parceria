import { apiRequest } from './api'

export const authService = {
  async register(userData) {
    return apiRequest('/register', {
      method: 'POST',
      body: userData
    })
  },

  async login(credentials) {
    return apiRequest('/login', {
      method: 'POST',
      body: credentials
    })
  },

  async getProfile() {
    return apiRequest('/me')
  },

  async updateProfile(userData) {
    return apiRequest('/profile', {
      method: 'PUT',
      body: userData
    })
  },

  async changePassword(passwordData) {
    return apiRequest('/change-password', {
      method: 'POST',
      body: passwordData
    })
  },

  async requestPasswordReset(email) {
    return apiRequest('/forgot-password', {
      method: 'POST',
      body: { email }
    })
  },

  async resetPassword(token, passwordData) {
    return apiRequest(`/reset-password/${token}`, {
      method: 'POST',
      body: passwordData
    })
  },

  async deleteAccount() {
    return apiRequest('/account', {
      method: 'DELETE'
    })
  }
}