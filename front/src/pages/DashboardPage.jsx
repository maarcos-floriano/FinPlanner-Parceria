import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarDays,
  Check,
  Edit2,
  MessageCircle,
  Plus,
  Search,
  Trash2,
  Wallet,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTransactions } from '../hooks/useTransactions'
import { CATEGORIES } from '../utils/constants'

const formatCurrency = (amount = 0) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(Number(amount) || 0)

const formatDate = (date) => {
  if (!date) return 'Hoje'
  return new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  })
}

const TransactionSheet = ({ initialType, editingTransaction, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: editingTransaction?.type || initialType || 'expense',
    amount: editingTransaction?.amount || '',
    category: editingTransaction?.category || CATEGORIES[0],
    date: editingTransaction?.date || new Date().toISOString().split('T')[0],
    description: editingTransaction?.description || ''
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Informe um valor maior que zero.')
      return
    }

    if (!formData.description.trim()) {
      setError('Escreva uma descricao curta.')
      return
    }

    setSaving(true)
    try {
      await onSave({
        ...formData,
        amount: Number(formData.amount)
      })
    } catch (saveError) {
      setError(saveError.message || 'Nao foi possivel salvar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4">
      <form
        onSubmit={submit}
        className="w-full md:max-w-md bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl p-4 md:p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">{editingTransaction ? 'Editar' : 'Novo lancamento'}</p>
            <h2 className="text-xl font-bold">
              {formData.type === 'expense' ? 'Registrar despesa' : 'Registrar entrada'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
            className={`py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${formData.type === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
            <ArrowDownCircle size={18} />
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
            className={`py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${formData.type === 'income' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
          >
            <ArrowUpCircle size={18} />
            Entrada
          </button>
        </div>

        <label className="block text-sm font-medium mb-2">Valor</label>
        <input
          autoFocus
          inputMode="decimal"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.amount}
          onChange={(event) => setFormData(prev => ({ ...prev, amount: event.target.value }))}
          className="w-full px-4 py-4 text-2xl font-bold mb-4"
          placeholder="0,00"
        />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Categoria</label>
            <select
              value={formData.category}
              onChange={(event) => setFormData(prev => ({ ...prev, category: event.target.value }))}
              className="w-full px-3 py-3"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Data</label>
            <input
              type="date"
              value={formData.date}
              onChange={(event) => setFormData(prev => ({ ...prev, date: event.target.value }))}
              className="w-full px-3 py-3"
            />
          </div>
        </div>

        <label className="block text-sm font-medium mb-2">Descricao</label>
        <input
          value={formData.description}
          onChange={(event) => setFormData(prev => ({ ...prev, description: event.target.value }))}
          className="w-full px-4 py-3 mb-3"
          placeholder="Mercado, salario, pix..."
        />

        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-lg bg-purple-600 text-white font-bold disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <Check size={18} />
          {saving ? 'Salvando...' : 'Salvar lancamento'}
        </button>
      </form>
    </div>
  )
}

const DashboardPage = () => {
  const { user, hasWhatsapp } = useAuth()
  const {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    editTransaction,
    removeTransaction
  } = useTransactions()
  const [sheetType, setSheetType] = useState(null)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    fetchTransactions().catch(() => {})
  }, [fetchTransactions])

  const monthTransactions = useMemo(() => {
    const now = new Date()
    return transactions.filter(transaction => {
      const date = new Date(`${transaction.date}T12:00:00`)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
  }, [transactions])

  const stats = useMemo(() => {
    const income = monthTransactions
      .filter(transaction => transaction.type === 'income')
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0)
    const expense = monthTransactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0)

    return {
      income,
      expense,
      balance: income - expense,
      count: monthTransactions.length
    }
  }, [monthTransactions])

  const visibleTransactions = useMemo(() => {
    return [...transactions]
      .filter(transaction => filter === 'all' || transaction.type === filter)
      .filter(transaction => {
        const text = `${transaction.description} ${transaction.category}`.toLowerCase()
        return text.includes(query.toLowerCase())
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 30)
  }, [transactions, filter, query])

  const openSheet = (type, transaction = null) => {
    setEditingTransaction(transaction)
    setSheetType(type || transaction?.type || 'expense')
  }

  const closeSheet = () => {
    setEditingTransaction(null)
    setSheetType(null)
  }

  const saveTransaction = async (payload) => {
    if (editingTransaction) {
      await editTransaction(editingTransaction.id, payload)
      setNotice('Lancamento atualizado.')
    } else {
      await addTransaction(payload)
      setNotice('Lancamento salvo.')
    }

    closeSheet()
    setTimeout(() => setNotice(''), 2200)
  }

  const deleteTransaction = async (id) => {
    const confirmed = window.confirm('Excluir este lancamento?')
    if (!confirmed) return

    await removeTransaction(id)
    setNotice('Lancamento excluido.')
    setTimeout(() => setNotice(''), 2200)
  }

  return (
    <div className="fade-in max-w-md mx-auto pb-28 md:max-w-5xl">
      <div className="mb-5">
        <p className="text-sm text-gray-500">Ola, {user?.name?.split(' ')[0] || 'usuario'}</p>
        <div className="flex items-center justify-between gap-3 mt-1">
          <h1 className="text-2xl font-bold">Seu dinheiro hoje</h1>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-800">
            {stats.count} no mes
          </span>
        </div>
      </div>

      <section className="rounded-2xl bg-gray-900 text-white p-5 mb-4 overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-gray-300">Saldo do mes</p>
            <p className="text-3xl font-bold mt-1 break-words">{formatCurrency(stats.balance)}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
            <Wallet size={22} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="rounded-xl bg-white/10 p-3 min-w-0">
            <p className="text-xs text-gray-300">Entrou</p>
            <p className="font-bold text-emerald-300 break-words">{formatCurrency(stats.income)}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3 min-w-0">
            <p className="text-xs text-gray-300">Saiu</p>
            <p className="font-bold text-red-300 break-words">{formatCurrency(stats.expense)}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => openSheet('expense')}
          className="h-24 rounded-2xl bg-red-600 text-white font-bold flex flex-col items-center justify-center gap-2 shadow-lg"
        >
          <ArrowDownCircle size={28} />
          Gastei
        </button>
        <button
          onClick={() => openSheet('income')}
          className="h-24 rounded-2xl bg-emerald-600 text-white font-bold flex flex-col items-center justify-center gap-2 shadow-lg"
        >
          <ArrowUpCircle size={28} />
          Recebi
        </button>
      </section>

      {hasWhatsapp && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900 p-3 flex items-center gap-3">
          <MessageCircle size={20} />
          <p className="text-sm">Seu plano WhatsApp esta ativo para registros rapidos.</p>
        </div>
      )}

      {(error || notice) && (
        <div className={`mb-4 rounded-lg px-3 py-2 text-sm ${error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
          {error || notice}
        </div>
      )}

      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-lg">Ultimos lancamentos</h2>
            <p className="text-xs text-gray-500">Toque para editar quando precisar</p>
          </div>
          <button
            onClick={() => openSheet('expense')}
            className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full pl-10 pr-3 py-3 text-sm"
            placeholder="Buscar lancamento"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            ['all', 'Todos'],
            ['expense', 'Saidas'],
            ['income', 'Entradas']
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`py-2 rounded-lg text-sm font-semibold ${filter === value ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading && transactions.length === 0 && (
          <p className="py-8 text-center text-gray-500">Carregando lancamentos...</p>
        )}

        {!loading && visibleTransactions.length === 0 && (
          <div className="py-8 text-center">
            <CalendarDays className="mx-auto text-gray-400 mb-3" size={28} />
            <p className="font-semibold">Nada registrado ainda</p>
            <p className="text-sm text-gray-500 mt-1">Use os botoes Gastei ou Recebi para comecar.</p>
          </div>
        )}

        <div className="space-y-2">
          {visibleTransactions.map(transaction => {
            const isIncome = transaction.type === 'income'
            return (
              <div
                key={transaction.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 min-w-0"
              >
                <button
                  onClick={() => openSheet(transaction.type, transaction)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isIncome ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'}`}
                >
                  {isIncome ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                </button>

                <button
                  onClick={() => openSheet(transaction.type, transaction)}
                  className="flex-1 min-w-0 text-left"
                >
                  <p className="font-semibold truncate">{transaction.description}</p>
                  <p className="text-xs text-gray-500 truncate">{transaction.category} - {formatDate(transaction.date)}</p>
                </button>

                <div className="text-right shrink-0">
                  <p className={`font-bold ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </p>
                  <div className="flex justify-end gap-1 mt-1">
                    <button onClick={() => openSheet(transaction.type, transaction)} className="p-1 text-gray-500">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => deleteTransaction(transaction.id)} className="p-1 text-gray-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="fixed bottom-4 left-0 right-0 z-40 px-4 md:hidden pointer-events-none">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3 pointer-events-auto">
          <button
            onClick={() => openSheet('expense')}
            className="py-3 rounded-full bg-red-600 text-white font-bold shadow-xl flex items-center justify-center gap-2"
          >
            <ArrowDownCircle size={18} />
            Gastei
          </button>
          <button
            onClick={() => openSheet('income')}
            className="py-3 rounded-full bg-emerald-600 text-white font-bold shadow-xl flex items-center justify-center gap-2"
          >
            <ArrowUpCircle size={18} />
            Recebi
          </button>
        </div>
      </div>

      {sheetType && (
        <TransactionSheet
          initialType={sheetType}
          editingTransaction={editingTransaction}
          onClose={closeSheet}
          onSave={saveTransaction}
        />
      )}
    </div>
  )
}

export default DashboardPage
