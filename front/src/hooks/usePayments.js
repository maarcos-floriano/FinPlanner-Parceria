import { useState, useCallback } from 'react'
import {
  activatePayment as apiActivatePayment,
} from '../services/api'

export const usePayment = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Ativar plano usando código
   */
  const activatePayment = useCallback(async (code) => {
    setLoading(true)
    setError(null)


    try {
        const body = {code: code}
      const data = await apiActivatePayment( body )

      /**
       * Opcional:
       * se o backend devolver o payment ativado,
       * você pode atualizar o estado local
       */
      if (data.payment) {
        setPayments(prev => [data.payment, ...prev])
      }

      return data
    } catch (err) {
      setError(err.message || 'Código inválido ou já utilizado')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    payments,
    loading,
    error,
    activatePayment
  }
}
