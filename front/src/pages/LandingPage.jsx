import { useNavigate } from 'react-router-dom'
import { Check, MessageCircle, PieChart, ShieldCheck, Smartphone, Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import PricingPlans from '../components/Premium/PricingPlans'

const LandingPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="fade-in">
      <section className="min-h-[72vh] flex items-center">
        <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-5">
              <ShieldCheck size={16} />
              Controle financeiro simples para continuar usando
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
              FinPlanner
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
              Um planejador financeiro mobile-first para registrar gastos em segundos, entender o mes e manter o cliente ativo com automacao opcional no WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(user ? '/dashboard' : '/auth')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
              >
                <Wallet size={20} />
                {user ? 'Abrir app' : 'Comecar agora'}
              </button>
              <button
                onClick={() => navigate('/premium')}
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Ver planos
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500">Saldo previsto</p>
                <p className="text-3xl font-bold">R$ 1.284,70</p>
              </div>
              <PieChart className="text-emerald-600" size={32} />
            </div>
            <div className="space-y-3">
              {[
                ['Mercado', 'Alimentacao', '- R$ 86,40'],
                ['Salario', 'Receita', '+ R$ 3.200,00'],
                ['WhatsApp', 'Lancamento automatico', '- R$ 19,90']
              ].map(([title, tag, value]) => (
                <div key={title} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-xs text-gray-500">{tag}</p>
                  </div>
                  <p className={value.startsWith('+') ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-10">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            [Smartphone, 'Mobile primeiro', 'Telas curtas, botoes claros e fluxo rapido para o cliente nao desistir.'],
            [PieChart, 'Clareza mensal', 'Resumo de receitas, despesas, categorias e historico em um so lugar.'],
            [MessageCircle, 'WhatsApp opcional', 'Plano superior usa n8n para registrar e consultar direto no app de conversa.']
          ].map(([Icon, title, text]) => (
            <div key={title} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
              <Icon className="text-emerald-600 mb-4" size={28} />
              <h2 className="font-bold text-lg mb-2">{title}</h2>
              <p className="text-gray-600 dark:text-gray-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="bg-gray-900 text-white rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-4">Pensado para ser viavel financeiramente</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {['Frontend gratis na Vercel', 'Backend barato em VPS quando validar', 'Dois planos para evitar complexidade comercial'].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <Check className="text-emerald-400 mt-0.5" size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-10">
        <PricingPlans />
      </section>
    </div>
  )
}

export default LandingPage
