import { useCallback, useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

import {
  updatePass as apiUpdatePass,
  resetPass as apiResetPass
} from "../services/api"

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const update = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiUpdatePass(data);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
    finally{
      setLoading(false);
    }
  }, [])

  const reset = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiResetPass(data);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
    finally{
      setLoading(false);
    }
  }, [])


  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return {...context, reset, update, loading, error}
}