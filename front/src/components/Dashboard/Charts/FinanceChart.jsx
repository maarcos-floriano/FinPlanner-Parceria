import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Registrar os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const FinanceChart = ({ transactions = [] }) => {
  // Gerar dados dos últimos 6 meses
  const getLast6MonthsData = () => {
    const result = {
      labels: [],
      income: [],
      expenses: []
    }
    
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' })
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

  const data = getLast6MonthsData()

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Receitas',
        data: data.income,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Despesas',
        data: data.expenses,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
    <div style={{ height: '200px' }}>
      <Line data={chartData} options={options} />
    </div>
  )
}

export default FinanceChart