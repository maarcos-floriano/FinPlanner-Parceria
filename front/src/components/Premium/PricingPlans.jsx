import { Check, MessageCircle, Smartphone, Zap } from 'lucide-react'
import { KIRVANO_ESSENTIAL_URL, KIRVANO_WHATSAPP_URL } from '../../utils/constants'

const plans = [
  {
    id: 'essential',
    name: 'Essencial',
    price: 'R$ 19,90',
    description: 'Para controlar o dinheiro pelo app, sem complicar a rotina.',
    icon: Smartphone,
    url: KIRVANO_ESSENTIAL_URL,
    features: ['Lancamentos ilimitados', 'Dashboard mensal', 'Relatorios por categoria', 'Metas financeiras']
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    price: 'R$ 29,90',
    description: 'Para registrar e consultar tudo pelo WhatsApp com automacao n8n.',
    icon: MessageCircle,
    url: KIRVANO_WHATSAPP_URL,
    featured: true,
    features: ['Tudo do Essencial', 'Registro por mensagem', 'Consulta de saldo pelo WhatsApp', 'Fluxo rapido para uso diario']
  }
]

const PricingPlans = () => {
  const handleCheckout = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
          <Zap size={16} />
          Produto low-ticket, simples de manter
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Escolha como voce quer registrar sua vida financeira</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          So existem dois planos. A unica diferenca e a automacao no WhatsApp.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <div
              key={plan.id}
              className={`bg-white dark:bg-gray-800 border rounded-lg p-6 ${plan.featured ? 'border-emerald-500 shadow-lg' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="text-emerald-600" size={22} />
                    <h2 className="text-2xl font-bold">{plan.name}</h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
                </div>
                {plan.featured && (
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                    Maior retencao
                  </span>
                )}
              </div>

              <p className="text-4xl font-bold mb-1">{plan.price}</p>
              <p className="text-sm text-gray-500 mb-6">por mes</p>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="text-emerald-600 mt-0.5" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.url)}
                className={`w-full py-3 rounded-lg font-semibold transition ${plan.featured ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'}`}
              >
                Assinar {plan.name}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PricingPlans
