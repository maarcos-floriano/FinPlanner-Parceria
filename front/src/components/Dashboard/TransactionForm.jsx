import { X } from 'lucide-react'
import { useState } from 'react'

const TransactionForm = ({ onSave, onCancel, editingTransaction = null }) => {
  const [formData, setFormData] = useState({
    type: editingTransaction?.type || 'expense',
    amount: editingTransaction?.amount || '',
    category: editingTransaction?.category || 'Alimentação',
    date: editingTransaction?.date || new Date().toISOString().split('T')[0],
    description: editingTransaction?.description || ''
  })

  const categories = [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Lazer',
    'Saúde',
    'Educação',
    'Salário',
    'Outros'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.amount || formData.amount <= 0) {
      alert('Por favor, insira um valor válido maior que zero.')
      return
    }
    if (!formData.description.trim()) {
      alert('Por favor, insira uma descrição.')
      return
    }
    
    onSave({
      ...formData,
      amount: parseFloat(formData.amount)
    })
  }

  const handleTypeChange = (type) => {
    setFormData(prev => ({ ...prev, type }))
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6 slide-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">
          {editingTransaction ? 'Editar Lançamento' : 'Novo Lançamento'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tipo</label>
            <div className="flex border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 py-2 text-center font-semibold border-r border-gray-300 dark:border-gray-700 ${
                  formData.type === 'income'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Receita
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-2 text-center font-semibold ${
                  formData.type === 'expense'
                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Despesa
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
              placeholder="0,00"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Categoria</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Data</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Descrição</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
              placeholder="Descrição breve"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            {editingTransaction ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TransactionForm