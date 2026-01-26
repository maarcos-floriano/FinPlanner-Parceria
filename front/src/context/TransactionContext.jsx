import React, { createContext, useState, useContext, useCallback } from 'react'
import { transactionService } from '../services/transactions'

const TransactionContext = createContext()

export const useTransactionsContext = () => {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error('useTransactionsContext must be used within a TransactionProvider')
  }
  return context
}

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({})
  const [filters, setFilters] = useState({})

  const fetchTransactions = useCallback(async (newFilters = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await transactionService.getAll(newFilters)
      setTransactions(data.transactions || [])
      setFilters(newFilters)
      return data.transactions || []
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await transactionService.getDashboardData()
      setStats(data.dashboard || {})
      return data.dashboard || {}
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const addTransaction = useCallback(async (transactionData) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await transactionService.create(transactionData)
      setTransactions(prev => [data.transaction, ...prev])
      
      // Atualizar estatísticas
      await fetchDashboardData()
      
      return data.transaction
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchDashboardData])

  const updateTransaction = useCallback(async (id, transactionData) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await transactionService.update(id, transactionData)
      setTransactions(prev => prev.map(t => 
        t.id === id ? data.transaction : t
      ))
      
      // Atualizar estatísticas
      await fetchDashboardData()
      
      return data.transaction
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchDashboardData])

  const deleteTransaction = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      await transactionService.delete(id)
      setTransactions(prev => prev.filter(t => t.id !== id))
      
      // Atualizar estatísticas
      await fetchDashboardData()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchDashboardData])

  const importTransactions = useCallback(async (file) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await transactionService.importTransactions(file)
      setTransactions(prev => [...data.transactions, ...prev])
      
      // Atualizar estatísticas
      await fetchDashboardData()
      
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchDashboardData])

  const exportTransactions = useCallback(async (format = 'csv') => {
    setLoading(true)
    setError(null)
    
    try {
      return await transactionService.exportTransactions(format)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value = {
    transactions,
    loading,
    error,
    stats,
    filters,
    fetchTransactions,
    fetchDashboardData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    importTransactions,
    exportTransactions,
    clearError
  }

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
}