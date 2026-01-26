import { Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return null // ou spinner

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}


export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return null // ou spinner

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
