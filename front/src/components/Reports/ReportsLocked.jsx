import { Crown, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ReportsLocked = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Lock className="text-white" size={32} />
      </div>
      <h3 className="text-xl font-bold mb-3">Relatórios Avançados Bloqueados</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        Desbloqueie relatórios detalhados, comparação histórica, alertas de gastos, 
        projeção financeira e muito mais com o plano PRO.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Voltar ao Dashboard
        </button>
        <button
          onClick={() => navigate('/premium')}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center"
        >
          <Crown className="mr-2" size={20} />
          Desbloquear Relatórios PRO
        </button>
      </div>
    </div>
  )
}

export default ReportsLocked