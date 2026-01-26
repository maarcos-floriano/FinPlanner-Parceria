import React, { createContext, useState, useContext, useEffect } from 'react'
import { apiRequest, login as apiLogin, register as apiRegister, getProfile } from '../services/api'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('finplanner_token')
      if (token) {
        const data = await getProfile()

        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('finplanner_token')
      localStorage.removeItem('finplanner_user')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password)
      localStorage.setItem('finplanner_token', data.token)
      localStorage.setItem('finplanner_user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const data = await apiRegister(name, email, password)
      localStorage.setItem('finplanner_token', data.token)
      localStorage.setItem('finplanner_user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('finplanner_token')
    localStorage.removeItem('finplanner_user')
    setUser(null)
  }

  const updateProfile = (userData) => {
    setUser(prev => ({ ...prev, ...userData }))
    localStorage.setItem('finplanner_user', JSON.stringify({ ...user, ...userData }))
  }

  const isProUser = user?.plan === 'premium'

  const value = {
    user,
    loading,
    isProUser,
    login,
    register,
    logout,
    updateProfile,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}