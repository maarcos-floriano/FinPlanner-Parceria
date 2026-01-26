import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

// Registrar os componentes do Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

const CategoryChart = ({ transactions = [] }) => {
  const getCategoryData = () => {
    const categoryTotals = {}
    
    // Calcular totais por categoria para despesas do mês atual
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const transDate = new Date(transaction.date)
        if (transDate.getMonth() === currentMonth && 
            transDate.getFullYear() === currentYear) {
          
          if (!categoryTotals[transaction.category]) {
            categoryTotals[transaction.category] = 0
          }
          categoryTotals[transaction.category] += parseFloat(transaction.amount)
        }
      }
    })
    
    // Converter para arrays
    const labels = Object.keys(categoryTotals)
    const values = Object.values(categoryTotals)
    
    // Se não houver dados, usar valores padrão
    if (labels.length === 0) {
      return {
        labels: ['Alimentação', 'Transporte', 'Moradia', 'Outros'],
        values: [25, 15, 35, 25]
      }
    }
    
    return { labels, values }
  }

  const { labels, values } = getCategoryData()

  const chartData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: [
        '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#6B7280'
      ],
      borderWidth: 2,
      borderColor: '#1F2937'
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  }

  return (
    <div style={{ height: '250px' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  )
}

export default CategoryChart