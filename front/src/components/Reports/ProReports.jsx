import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertTriangle, Bell, Crown, FileDown, TrendingDown } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const ProReports = ({ transactions = [] }) => {
  const getComparisonData = () => {
    const result = {
      labels: [],
      income: [],
      expenses: []
    }
    
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(now, i)
      const monthName = format(date, 'MMM', { locale: ptBR })
      result.labels.push(monthName.charAt(0).toUpperCase() + monthName.slice(1))
      
      // Calcular receitas e despesas para este mês
      const month = date.getMonth()
      const year = date.getFullYear()
      
      const monthIncome = transactions
        .filter(t => t.type === 'income' && 
               new Date(t.date).getMonth() === month && 
               new Date(t.date).getFullYear() === year)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      
      const monthExpenses = transactions
        .filter(t => t.type === 'expense' && 
               new Date(t.date).getMonth() === month && 
               new Date(t.date).getFullYear() === year)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
      
      result.income.push(monthIncome)
      result.expenses.push(monthExpenses)
    }
    
    return result
  }

  const comparisonData = getComparisonData()

  const chartData = {
    labels: comparisonData.labels,
    datasets: [
      {
        label: 'Receitas',
        data: comparisonData.income,
        backgroundColor: '#10B981',
        borderRadius: 6
      },
      {
        label: 'Despesas',
        data: comparisonData.expenses,
        backgroundColor: '#EF4444',
        borderRadius: 6
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'R$ ' + value
          }
        }
      }
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6 mb-6">
      <div className="flex items-center mb-4">
        <Crown className="text-purple-500 mr-3" size={24} />
        <h2 className="font-bold text-lg">Relatórios PRO</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white/10 p-6 rounded-xl">
          <h3 className="font-bold mb-4">Comparativo últimos 6 meses</h3>
          <Bar data={chartData} options={options} />
        </div>
        
        <div>
          <h3 className="font-bold mb-4">Metas Atingidas</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Economia Mensal</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Fundo de Emergência</span>
                <span>40%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="font-bold mb-3">Alertas de Gasto</h4>
            <div className="space-y-2">
              <div className="flex items-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <AlertTriangle className="text-yellow-500 mr-3" size={20} />
                <div>
                  <p className="font-semibold">Alerta: Alimentação</p>
                  <p className="text-sm">Você já gastou 90% do orçamento desta categoria</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/10 p-4 rounded-xl">
          <div className="flex items-center mb-2">
            <TrendingDown className="text-green-400 mr-2" size={20} />
            <h4 className="font-bold">Projeção Financeira</h4>
          </div>
          <p className="text-sm">
            Baseado nos seus hábitos, você pode economizar R$ 5.400,00 até o final do ano.
          </p>
        </div>
        
        <div className="bg-white/10 p-4 rounded-xl">
          <div className="flex items-center mb-2">
            <FileDown className="text-blue-400 mr-2" size={20} />
            <h4 className="font-bold">Exportação de Dados</h4>
          </div>
          <p className="text-sm">
            Exporte todos os seus dados para Excel, PDF ou CSV com um clique.
          </p>
          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
            <FileDown className="inline mr-2" size={16} />
            Exportar Dados
          </button>
        </div>
        
        <div className="bg-white/10 p-4 rounded-xl">
          <div className="flex items-center mb-2">
            <Bell className="text-yellow-400 mr-2" size={20} />
            <h4 className="font-bold">Benefícios Financeiros</h4>
          </div>
          <p className="text-sm">
            Receba insights personalizados para otimizar seus investimentos e economias.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProReports