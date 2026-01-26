import { useState, useCallback } from 'react'
import { 
  getTransactions as apiGetTransactions, 
  createTransaction as apiCreateTransaction,
  updateTransaction as apiUpdateTransaction,
  deleteTransaction as apiDeleteTransaction,
  getDashboardData
} from '../services/api'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTransactions = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiGetTransactions(filters)
      setTransactions(data.transactions || [])
      return data.transactions || []
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
      const data = await apiCreateTransaction(transactionData)
      setTransactions(prev => [data.transaction, ...prev])
      return data.transaction
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const editTransaction = useCallback(async (id, transactionData) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiUpdateTransaction(id, transactionData)
      setTransactions(prev => prev.map(t => 
        t.id === id ? data.transaction : t
      ))
      return data.transaction
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const removeTransaction = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    
    try {
      await apiDeleteTransaction(id)
      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])
  
  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getDashboardData()
      // setDashboardData(response.)
      return response.dashboard
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    fetchDashboard,
    addTransaction,
    editTransaction,
    removeTransaction
  }
}