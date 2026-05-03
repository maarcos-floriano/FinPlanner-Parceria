import { Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-600 dark:text-gray-400">
        Carregando sua conta...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}


export const PublicRoute = ({ children }) => {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
