import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

const DashboardStats = ({ stats, userPlan }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Saldo Mensal</p>
            <p className="text-2xl font-bold">
              {formatCurrency(stats.monthly_balance || 0)}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <Wallet className="text-blue-600" size={24} />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Receitas Total</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.total_income || 0)}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Despesas Total</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.total_expenses || 0)}
            </p>
          </div>
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
            <TrendingDown className="text-red-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardStats