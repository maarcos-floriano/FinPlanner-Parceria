import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'

const TransactionList = ({ transactions, onEdit, onDelete, onFilterChange }) => {
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filteredTransactions, setFilteredTransactions] = useState([])

  useEffect(() => {
    let filtered = [...transactions]
    
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType)
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory)
    }
    
    // Ordenar por data (mais recente primeiro)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    setFilteredTransactions(filtered)
    
    // Notificar componente pai sobre mudanças de filtro
    if (onFilterChange) {
      onFilterChange({ type: filterType, category: filterCategory })
    }
  }, [transactions, filterType, filterCategory])

  const categories = [...new Set(transactions.map(t => t.category))]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingDown className="text-gray-500" size={24} />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhuma transação</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Comece adicionando sua primeira transação
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="font-bold text-lg">Histórico</h2>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm"
          >
            <option value="all">Todos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm"
          >
            <option value="all">Todas Categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredTransactions.map(transaction => {
          const isIncome = transaction.type === 'income'
          
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition group"
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                  isIncome 
                    ? 'bg-green-100 dark:bg-green-900'
                    : 'bg-red-100 dark:bg-red-900'
                }`}>
                  {isIncome ? (
                    <TrendingUp className={isIncome ? 'text-green-600' : 'text-red-600'} size={20} />
                  ) : (
                    <TrendingDown className="text-red-600" size={20} />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`font-bold ${
                  isIncome ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
                </span>
                
                <button
                  onClick={() => onEdit(transaction)}
                  className="p-2 text-gray-500 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
                
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="p-2 text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
      
      {filteredTransactions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma transação encontrada com os filtros atuais</p>
        </div>
      )}
    </div>
  )
}

export default TransactionList