import { apiRequest } from './api'

export const transactionService = {
  async getAll(filters = {}) {
    const queryString = new URLSearchParams(filters).toString()
    return apiRequest(`/transactions${queryString ? `?${queryString}` : ''}`)
  },

  async getById(id) {
    return apiRequest(`/transactions/${id}`)
  },

  async create(transactionData) {
    return apiRequest('/transactions', {
      method: 'POST',
      body: transactionData
    })
  },

  async update(id, transactionData) {
    return apiRequest(`/transactions/${id}`, {
      method: 'PUT',
      body: transactionData
    })
  },

  async delete(id) {
    return apiRequest(`/transactions/${id}`, {
      method: 'DELETE'
    })
  },

  async getDashboardData() {
    return apiRequest('/dashboard')
  },

  async getStats(timeframe = 'month') {
    return apiRequest(`/stats?timeframe=${timeframe}`)
  },

  async getCategorySummary() {
    return apiRequest('/transactions/categories/summary')
  },

  async importTransactions(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiRequest('/transactions/import', {
      method: 'POST',
      body: formData,
      headers: {}
    })
  },

  async exportTransactions(format = 'csv') {
    return apiRequest(`/transactions/export?format=${format}`)
  }
}