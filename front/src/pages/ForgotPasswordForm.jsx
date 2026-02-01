import { useState } from 'react'
import { Mail, Lock, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/UI/Modal'

const ForgotPasswordForm = () => {
  const [modal, setModal] = useState({
      isOpen: false,
      text: "",
      title: "",
  });
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('email')

  const { reset, update } = useAuth();

  const navigate = useNavigate()


  const handleOnCloseModal = () => {
    setModal({
      isOpen: false,
      text: '',
      title: '',
    });    
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = reset({email: email})
      console.log(res);

      setModal({
        isOpen: true,
        text: 'Check sua caixa de email',
        title: 'Notificação',
      });
      setTimeout(() => {
        setModal({
          isOpen: false,
          text: '',
          title: '',
        });    
      }, 2000);  

      
      setStep('reset')
    } catch (err) {
      alert('Erro ao enviar email de recuperação')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('As senhas não coincidem')
      return
    }
    
    setLoading(true)

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    
    try {
      // 🔐 chama API → redefinir senha
      const res = update({newPass: password, token: token});
      console.log(res);

        setModal({
          isOpen: true,
          text: 'Redirecionando para o login...',
          title: 'Notificação',
        });
        setTimeout(() => {
          setModal({
            isOpen: false,
            text: '',
            title: '',
          });    
          navigate("/auth");
        }, 2000);  
      
      setStep('done')
    } catch (err) {
      alert('Erro ao redefinir senha')
    } finally {
      setLoading(false)
    }
  }

  /* ===== ETAPA FINAL ===== */
  if (step === 'done') {
    return (
      <div className="text-center">
        <h3 className="text-base font-semibold mb-2">Senha alterada com sucesso 🔐</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Você já pode entrar com sua nova senha.
        </p>

        <button
          onClick={() => navigate('/auth', { state: { isLogin: true } })}
          className="text-purple-600 font-semibold hover:underline text-sm"
        >
          Ir para o login
        </button>
      </div>
    )
  }

  /* ===== ETAPA 2 – NOVA SENHA ===== */
  if (step === 'reset') {
    return (
      <form onSubmit={handleUpdatePassword} className="max-w-sm mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nova senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Confirmar senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-purple-600 text-white rounded-md font-semibold"
        >
          {loading ? 'Salvando...' : 'Redefinir senha'}
        </button>
      </form>
    )
  }

  /* ===== ETAPA 1 – EMAIL ===== */
  return (
    <form onSubmit={handleEmailSubmit} className="max-w-sm mx-auto">
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
            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm"
            placeholder="email@exemplo.com"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-purple-600 text-white rounded-md font-semibold mb-3"
      >
        {loading ? 'Enviando...' : 'Continuar'}
      </button>

      <button
        type="button"
        onClick={() => navigate('/auth', { state: { isLogin: true } })}
        className="w-full flex items-center justify-center text-xs text-gray-600 hover:underline"
      >
        <ArrowLeft size={14} className="mr-1" />
        Voltar para o login
      </button>
       <Modal
          isOpen={modal.isOpen}
          onClose={handleOnCloseModal}
          title={modal.title}
          children={modal.text}
      />
    </form>
  )
}

export default ForgotPasswordForm
