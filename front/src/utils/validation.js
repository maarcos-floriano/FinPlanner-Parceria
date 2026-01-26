export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  // Mínimo 6 caracteres
  if (password.length < 6) {
    return { valid: false, message: 'A senha deve ter pelo menos 6 caracteres' }
  }
  
  // Pode adicionar mais validações se quiser
  // if (!/[A-Z]/.test(password)) {
  //   return { valid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' }
  // }
  // if (!/[0-9]/.test(password)) {
  //   return { valid: false, message: 'A senha deve conter pelo menos um número' }
  // }
  
  return { valid: true, message: '' }
}

export const validateTransaction = (transaction) => {
  const errors = {}

  if (!transaction.amount || transaction.amount <= 0) {
    errors.amount = 'Valor deve ser maior que zero'
  }

  if (!transaction.description?.trim()) {
    errors.description = 'Descrição é obrigatória'
  }

  if (!transaction.category) {
    errors.category = 'Categoria é obrigatória'
  }

  if (!transaction.date) {
    errors.date = 'Data é obrigatória'
  } else if (new Date(transaction.date) > new Date()) {
    errors.date = 'Data não pode ser futura'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateUserProfile = (userData) => {
  const errors = {}

  if (!userData.name?.trim()) {
    errors.name = 'Nome é obrigatório'
  }

  if (!userData.email?.trim()) {
    errors.email = 'Email é obrigatório'
  } else if (!validateEmail(userData.email)) {
    errors.email = 'Email inválido'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const formatCurrencyInput = (value) => {
  // Remove tudo que não é número ou ponto decimal
  const numericValue = value.replace(/[^\d,]/g, '')
  
  // Substitui vírgula por ponto para cálculos
  const normalizedValue = numericValue.replace(',', '.')
  
  // Verifica se é um número válido
  const number = parseFloat(normalizedValue)
  
  if (isNaN(number)) {
    return { value: '', number: 0 }
  }
  
  // Formata para exibição
  const formatted = number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  
  return { value: formatted, number }
}

export const parseCurrency = (value) => {
  if (!value) return 0
  
  const normalized = value
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^\d.]/g, '')
  
  return parseFloat(normalized) || 0
}