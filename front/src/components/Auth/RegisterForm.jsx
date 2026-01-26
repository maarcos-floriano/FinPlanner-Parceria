import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'

const RegisterForm = ({ onToggleForm }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    
    setLoading(true)
    
    try {
      const result = await register(name, email, password)
      if (result.success) {
        navigate('/dashboard')
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert('Erro ao criar conta: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Nome</label>
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
            placeholder="Seu nome"
            required
          />
        </div>
      </div>
      
      <div className="mb-4">
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
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold mb-4 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Criando conta...' : 'Criar Conta'}
      </button>
      
      <div className="text-center">
        <p className="text-sm">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={onToggleForm}
            className="text-purple-600 font-semibold hover:underline"
          >
            Clique aqui para entrar
          </button>
        </p>
      </div>
    </form>
  )
}

export default RegisterForm