import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Chrome, Facebook, Mail, Lock } from 'lucide-react'

const LoginForm = ({ onToggleForm }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await login(email, password)
      if (result.success) {
        navigate('/dashboard')
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert('Erro ao fazer login: ' + error.message)
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
      
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">Ou entre com</p>
        <div className="flex justify-center space-x-4 mt-3">
          <button
            type="button"
            className="p-3 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Chrome className="text-red-500" size={20} />
          </button>
          <button
            type="button"
            className="p-3 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Facebook className="text-blue-600" size={20} />
          </button>
        </div>
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