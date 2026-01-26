import { useState } from 'react'
import { Mail, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 🔐 aqui você chama sua API
      setSuccess(true)
    } catch (err) {
      alert('Erro ao enviar email de recuperação')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <h3 className="text-base font-semibold mb-2">Email enviado 📩</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Se existir uma conta com esse email, você receberá um link para redefinir sua senha.
        </p>

        <button
          onClick={() => navigate('/auth', { state: { isLogin: true } })}
          className="text-purple-600 font-semibold hover:underline text-sm"
        >
          Voltar para o login
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Email cadastrado
        </label>

        <div className="relative">
          <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full
              pl-9 pr-3 py-2
              border border-gray-300 dark:border-gray-700
              rounded-md
              bg-gray-50 dark:bg-gray-900
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-purple-500
            "
            placeholder="email@exemplo.com"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          py-2.5
          bg-purple-600
          text-white
          rounded-md
          font-semibold
          mb-3
          hover:bg-purple-700
          transition
          disabled:opacity-50
        "
      >
        {loading ? 'Enviando...' : 'Enviar link de recuperação'}
      </button>

      <button
        type="button"
        onClick={() => navigate('/auth', { state: { isLogin: true } })}
        className="
          w-full
          flex
          items-center
          justify-center
          text-xs
          text-gray-600 dark:text-gray-400
          hover:underline
        "
      >
        <ArrowLeft size={14} className="mr-1" />
        Voltar para o login
      </button>
    </form>
  )
}

export default ForgotPasswordForm
