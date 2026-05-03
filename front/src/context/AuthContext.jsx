import React, { createContext, useState, useContext, useEffect } from 'react'
import { login as apiLogin, register as apiRegister, getProfile, googleLogin as apiGoogleLogin } from '../services/api'

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

  const persistSession = (data) => {
    localStorage.setItem('finplanner_token', data.token)
    localStorage.setItem('finplanner_user', JSON.stringify(data.user))
    setUser(data.user)
  }

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
      persistSession(data)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const data = await apiRegister(name, email, password)
      persistSession(data)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const loginWithGoogle = async (credential) => {
    try {
      const data = await apiGoogleLogin(credential)
      persistSession(data)
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
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem('finplanner_user', JSON.stringify(updatedUser))
  }

  const isProUser = ['essential', 'whatsapp', 'premium'].includes(user?.plan)
  const hasWhatsapp = user?.plan === 'whatsapp'

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isProUser,
      hasWhatsapp,
      login,
      register,
      loginWithGoogle,
      logout,
      updateProfile,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}
