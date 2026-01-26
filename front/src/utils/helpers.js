export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount || 0)
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

export const getInitials = (name) => {
  return name
    ?.split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'
}

export const calculateMonthlyStats = (transactions) => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const monthTransactions = transactions.filter(t => {
    const transDate = new Date(t.date)
    return transDate.getMonth() === currentMonth && 
           transDate.getFullYear() === currentYear
  })
  
  const totalIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  
  const totalExpenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  
  return {
    monthlyBalance: totalIncome - totalExpenses,
    totalIncome,
    totalExpenses,
    transactionCount: monthTransactions.length
  }
}