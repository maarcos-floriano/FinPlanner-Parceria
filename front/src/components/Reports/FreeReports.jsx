import { TrendingDown } from 'lucide-react'
import CategoryChart from '../Dashboard/Charts/CategoryChart'

const FreeReports = ({ transactions = [] }) => {
  const getCategorySummary = () => {
    const categoryTotals = {}
    
    // Calcular totais por categoria para despesas
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        if (!categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] = 0
        }
        categoryTotals[transaction.category] += parseFloat(transaction.amount)
      }
    })
    
    // Calcular total de despesas
    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)
    
    // Ordenar categorias por valor (maior primeiro)
    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
    
    return { sortedCategories, totalExpenses }
  }

  const { sortedCategories, totalExpenses } = getCategorySummary()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
      <h2 className="font-bold text-lg mb-6">Visão Geral do Mês</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <CategoryChart transactions={transactions} />
        </div>
        <div>
          <h3 className="font-bold mb-4">Resumo por Categoria</h3>
          <div className="space-y-4">
            {sortedCategories.map(([category, amount]) => {
              const percentage = totalExpenses > 0 ? (amount / totalExpenses * 100).toFixed(0) : 0
              
              return (
                <div key={category} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{category}</span>
                    <span>
                      {formatCurrency(amount)} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
            
            {sortedCategories.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <TrendingDown className="mx-auto mb-3 text-gray-400" size={32} />
                <p>Nenhuma despesa registrada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FreeReports