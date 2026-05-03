import { API_BASE_URL } from '../utils/constants'

// Interceptor para tratar erros globais
const responseInterceptor = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    
    // Tratamento específico para erros de autenticação
    if (response.status === 401) {
      localStorage.removeItem('finplanner_token')
      localStorage.removeItem('finplanner_user')
      window.location.href = '/auth?session_expired=true'
      throw new Error('Sessão expirada. Por favor, faça login novamente.')
    }
    
    // Tratamento para limite do plano free
    if (response.status === 403 && errorData.upgradeRequired) {
      const error = new Error(errorData.error || 'Limite atingido')
      error.upgradeRequired = true
      error.limit = errorData.limit
      error.current = errorData.current
      throw error
    }
    
    // Tratamento para recursos premium
    if (response.status === 403 && errorData.error?.includes('Premium')) {
      const error = new Error(errorData.error)
      error.premiumRequired = true
      throw error
    }

    throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`)
  }
  
  return response.json()
}

// Função principal para requisições à API
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('finplanner_token')
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  }
  
  if (options.body && typeof options.body !== 'string') {
    config.body = JSON.stringify(options.body)
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    return await responseInterceptor(response)
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Upload de arquivos
export const apiUpload = async (endpoint, file, additionalData = {}) => {
  const token = localStorage.getItem('finplanner_token')
  
  const formData = new FormData()
  formData.append('file', file)
  
  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key])
  })
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: formData
  })
  
  return responseInterceptor(response)
}

// Autenticação
export const login = (email, password) => {
  return apiRequest('/login', {
    method: 'POST',
    body: { email, password }
  })
}

export const googleLogin = (credential) => {
  return apiRequest('/auth/google', {
    method: 'POST',
    body: { credential }
  })
}

export const register = (name, email, password) => {
  return apiRequest('/register', {
    method: 'POST',
    body: { name, email, password }
  })
}

export const getProfile = () => {
  return apiRequest('/me')
}

export const updateProfile = (userData) => {
  return apiRequest('/profile', {
    method: 'PUT',
    body: userData
  })
}


export const updatePass = (userData) => {
  return apiRequest('/update-pass', {
    method: 'POST',
    body: userData
  })
}


export const resetPass = (userData) => {
  return apiRequest('/reset-pass', {
    method: 'POST',
    body: userData
  })
}

// Transações
export const getTransactions = (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString()
  return apiRequest(`/transactions${queryString ? `?${queryString}` : ''}`)
}

export const createTransaction = (transactionData) => {
  return apiRequest('/transactions', {
    method: 'POST',
    body: transactionData
  })
}

export const updateTransaction = (id, transactionData) => {
  return apiRequest(`/transactions/${id}`, {
    method: 'PUT',
    body: transactionData
  })
}

export const deleteTransaction = (id) => {
  return apiRequest(`/transactions/${id}`, {
    method: 'DELETE'
  })
}

export const getDashboardData = () => {
  return apiRequest('/dashboard')
}

export const getCategorySummary = () => {
  return apiRequest('/transactions/categories/summary')
}

// Metas (Premium)
export const getGoals = () => {
  return apiRequest('/goals')
}

export const createGoal = (goalData) => {
  return apiRequest('/goals', {
    method: 'POST',
    body: goalData
  })
}

export const updateGoal = (id, goalData) => {
  return apiRequest(`/goals/${id}`, {
    method: 'PUT',
    body: goalData
  })
}

export const deleteGoal = (id) => {
  return apiRequest(`/goals/${id}`, {
    method: 'DELETE'
  })
}

// Stripe
export const createCheckoutSession = (plan = 'essential') => {
  return apiRequest('/checkout', {
    method: 'POST',
    body: { plan }
  })
}

export const getSubscription = () => {
  return apiRequest('/subscription')
}

export const cancelSubscription = () => {
  return apiRequest('/subscription/cancel', {
    method: 'POST'
  })
}

// Exportação de dados
export const exportData = (format = 'json') => {
  return apiRequest(`/export?format=${format}`)
}

// Upload de extrato bancário
export const uploadBankStatement = (file) => {
  return apiUpload('/transactions/import/bank-statement', file)
}

export const activatePayment = (data) => {
  return apiRequest('/payments/activate', {
    method: "POST",
    body: data
  });
}

export const getAdminOverview = () => apiRequest('/admin/overview')

export const getAdminUsers = (filters = {}) => {
  const queryString = new URLSearchParams(filters).toString()
  return apiRequest(`/admin/users${queryString ? `?${queryString}` : ''}`)
}

export const updateAdminUser = (id, data) => {
  return apiRequest(`/admin/users/${id}`, {
    method: 'PUT',
    body: data
  })
}

