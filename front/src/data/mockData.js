// Dados EXATOS do HTML original para garantir visual idêntico
export const mockTransactions = [
  {
    id: '1',
    type: 'income',
    amount: 4500,
    category: 'Salário',
    date: '2023-10-05',
    description: 'Salário mensal'
  },
  {
    id: '2',
    type: 'expense',
    amount: 1200,
    category: 'Moradia',
    date: '2023-10-10',
    description: 'Aluguel'
  },
  {
    id: '3',
    type: 'expense',
    amount: 350,
    category: 'Alimentação',
    date: '2023-10-12',
    description: 'Supermercado'
  },
  {
    id: '4',
    type: 'expense',
    amount: 180,
    category: 'Transporte',
    date: '2023-10-15',
    description: 'Combustível'
  },
  {
    id: '5',
    type: 'income',
    amount: 500,
    category: 'Outros',
    date: '2023-10-20',
    description: 'Freelance'
  }
]

export const mockStats = {
  monthly_balance: 1380,
  total_income: 12580,
  total_expenses: 1286,
  monthTransactionCount: 5
}

export const mockUser = {
  id: '1',
  name: 'Usuário Demo',
  email: 'demo@finplanner.com',
  plan: 'free',
  created_at: '2023-10-01'
}