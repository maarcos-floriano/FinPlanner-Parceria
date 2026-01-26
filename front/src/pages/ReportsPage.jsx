import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTransactions } from '../hooks/useTransactions'
import FreeReports from '../components/Reports/FreeReports'
import ProReports from '../components/Reports/ProReports'
import ReportsLocked from '../components/Reports/ReportsLocked'
import { BarChart3 } from "lucide-react"

const ReportsPage = () => {
  const { user, isProUser } = useAuth()
  const navigate = useNavigate()
  const { transactions, fetchTransactions, loading } = useTransactions()
  const [filter, setFilter] = useState('month')

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando relatórios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Relatórios</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Análise detalhada das suas finanças
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
            >
              <option value="month">Este Mês</option>
              <option value="quarter">Este Trimestre</option>
              <option value="year">Este Ano</option>
              <option value="all">Todo Período</option>
            </select>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center"
            >
              <BarChart3 className="mr-2" size={18} />
              Dashboard
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Receitas</p>
            <p className="text-xl font-bold text-green-600">
              R$ {transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Despesas</p>
            <p className="text-xl font-bold text-red-600">
              R$ {transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-500">Saldo Total</p>
            <p className="text-xl font-bold">
              R$ {(transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0) -
                transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0))
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-500">Transações</p>
            <p className="text-xl font-bold">{transactions.length}</p>
          </div>
        </div>
      </div>
      
      <FreeReports transactions={transactions} />
      
      {isProUser ? (
        <ProReports transactions={transactions} />
      ) : (
        <ReportsLocked />
      )}
    </div>
  )
}

export default ReportsPage