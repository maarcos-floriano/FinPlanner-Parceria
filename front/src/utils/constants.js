export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
export const KIRVANO_ESSENTIAL_URL = import.meta.env.VITE_KIRVANO_ESSENTIAL_URL || 'https://pay.kirvano.com/4a02d232-f4d5-4e65-b757-65df59990bc7'
export const KIRVANO_WHATSAPP_URL = import.meta.env.VITE_KIRVANO_WHATSAPP_URL || 'https://pay.kirvano.com/3bc35847-e2e3-4bf1-953c-f2cf26bbd353'

export const CATEGORIES = [
  'Alimentacao',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saude',
  'Educacao',
  'Salario',
  'Assinaturas',
  'Investimentos',
  'Outros'
]

export const PLAN_FEATURES = {
  free: [
    'Teste do app antes de assinar',
    '20 lancamentos no mes',
    'Dashboard simples'
  ],
  essential: [
    'Lancamentos ilimitados',
    'Relatorios e dashboard',
    'Metas e alertas',
    'App mobile-first'
  ],
  whatsapp: [
    'Tudo do Essencial',
    'Registro por WhatsApp via n8n',
    'Consultas de saldo no WhatsApp',
    'Fluxo rapido para uso diario'
  ]
}
