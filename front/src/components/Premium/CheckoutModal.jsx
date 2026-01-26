import { useState } from 'react'
import { X, CreditCard, Shield, Check } from 'lucide-react'
import { createCheckoutSession } from '../../services/stripe'

const CheckoutModal = ({ isOpen, onClose, user }) => {
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const { url } = await createCheckoutSession()
      window.location.href = url
    } catch (error) {
      alert('Erro ao iniciar checkout: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Finalizar Assinatura</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-4">
            <h4 className="font-bold mb-2">Plano Pro - R$ 19,90/mês</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cobrança mensal recorrente. Cancele quando quiser.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start">
              <Check className="text-green-500 mt-1 mr-3" size={18} />
              <span>Transações ilimitadas</span>
            </div>
            <div className="flex items-start">
              <Check className="text-green-500 mt-1 mr-3" size={18} />
              <span>Relatórios avançados</span>
            </div>
            <div className="flex items-start">
              <Check className="text-green-500 mt-1 mr-3" size={18} />
              <span>Metas e alertas</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <CreditCard className="mr-2" size={16} />
            <span>Pagamento seguro com Stripe</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Shield className="mr-2" size={16} />
            <span>Garantia de 7 dias para reembolso</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : 'Pagar com Cartão'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutModal