import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import GoogleButton from './GoogleButton'

const LoginForm = ({ onToggleForm }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    
    try {
      const result = await login(email, password)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setErrorMessage(result.error || 'Nao foi possivel entrar. Confira email e senha.')
      }
    } catch (error) {
      setErrorMessage(error.message || 'Erro ao fazer login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
            placeholder="email@exemplo.com"
            required
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Senha</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
            placeholder="Sua senha"
            required
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold mb-4 hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Ou entre com</p>
        <GoogleButton />
      </div>
      
      <div className="text-center">
        <p className="text-sm">
          Não tem uma conta?{' '}
          <button
            type="button"
            onClick={onToggleForm}
            className="text-purple-600 font-semibold hover:underline"
          >
            Clique aqui para criar
          </button>
        </p>
      </div>
    </form>
  )
}

export default LoginForm
