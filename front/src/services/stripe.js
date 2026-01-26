import { apiRequest } from './api'

export const stripeService = {
  async createCheckoutSession(priceId = 'price_pro_monthly') {
    return apiRequest('/stripe/create-checkout-session', {
      method: 'POST',
      body: { priceId }
    })
  },

  async createPortalSession() {
    return apiRequest('/stripe/create-portal-session', {
      method: 'POST'
    })
  },

  async getSubscription() {
    return apiRequest('/stripe/subscription')
  },

  async cancelSubscription() {
    return apiRequest('/stripe/cancel-subscription', {
      method: 'POST'
    })
  },

  async updateSubscription(priceId) {
    return apiRequest('/stripe/update-subscription', {
      method: 'POST',
      body: { priceId }
    })
  },

  async getInvoices() {
    return apiRequest('/stripe/invoices')
  },

  async getPaymentMethods() {
    return apiRequest('/stripe/payment-methods')
  },

  async addPaymentMethod(paymentMethodId) {
    return apiRequest('/stripe/payment-methods', {
      method: 'POST',
      body: { paymentMethodId }
    })
  },

  async setDefaultPaymentMethod(paymentMethodId) {
    return apiRequest('/stripe/payment-methods/default', {
      method: 'POST',
      body: { paymentMethodId }
    })
  },

  async removePaymentMethod(paymentMethodId) {
    return apiRequest(`/stripe/payment-methods/${paymentMethodId}`, {
      method: 'DELETE'
    })
  }
}