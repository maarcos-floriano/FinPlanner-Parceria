export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Salário',
  'Outros'
]

export const PLAN_FEATURES = {
  free: [
    'Até 20 transações/mês',
    'Dashboard básico',
    'Histórico simples',
    '1 categoria personalizada'
  ],
  premium: [
    'Transações ilimitadas',
    'Relatórios avançados',
    'Metas e alertas',
    'Exportação de dados',
    'Categorias ilimitadas',
    'Suporte prioritário'
  ]
}