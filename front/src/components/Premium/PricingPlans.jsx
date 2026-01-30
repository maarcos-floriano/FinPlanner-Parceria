import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Check, Crown, X } from "lucide-react"
import Modal from '../UI/Modal'
import { useState } from 'react'

const PricingPlans = () => {
  const { user, isProUser } = useAuth()

  const navigate = useNavigate();

    const [modal, setModal] = useState({
      isOpen: false,
      text: "",
      title: "",
    });
  

  const handleOnCloseModal = () => {
    setModal({
      isOpen: false,
      text: '',
      title: '',
    });    
  }


  const handleCheckout = async () => {
    // Integração com Stripe será implementada aqui
    setModal({
      isOpen: true,
      text: 'Redirecionando para checkout...',
      title: 'Notificação',
    });
    const timer = setTimeout(() => {
      setModal({
        isOpen: false,
        text: '',
        title: '',
      });    
      navigate("/auth");
      window.open(
        "https://pay.kirvano.com/bd353e05-2ba0-4e19-b68b-fd8c6b9ea069",
        "_blank",
        "noopener,noreferrer"
      );
    }, 2000);  

    return () => clearTimeout(timer);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Upgrade para FinPlanner PRO</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Desbloqueie todo o potencial do seu planejamento financeiro
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Plano Free</h3>
            <p className="text-4xl font-bold mb-1">R$ 0</p>
            <p className="text-gray-500">para sempre</p>
          </div>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <Check className="text-green-500 mt-1 mr-3" size={20} />
              <span>Até 20 transações por mês</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mt-1 mr-3" size={20} />
              <span>Dashboard básico</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mt-1 mr-3" size={20} />
              <span>Histórico simples</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 mt-1 mr-3" size={20} />
              <span>1 categoria personalizada</span>
            </li>
            <li className="flex items-start">
              <X className="text-gray-400 mt-1 mr-3" size={20} />
              <span className="text-gray-500">Relatórios avançados</span>
            </li>
            <li className="flex items-start">
              <X className="text-gray-400 mt-1 mr-3" size={20} />
              <span className="text-gray-500">Metas e alertas</span>
            </li>
          </ul>
          
          <Link
            to="/dashboard"
            className="w-full py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition block text-center"
          >
            Continuar no Free
          </Link>
        </div>
        
        <div className="bg-gradient-to-b from-purple-900 to-gray-900 rounded-xl shadow-lg p-8 border-2 border-purple-500 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="pro-badge px-6 py-2 rounded-full text-white font-bold">
              MELHOR OFERTA
            </span>
          </div>
          
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2 text-white">Plano Pro</h3>
            <p className="text-4xl font-bold mb-1 text-white">R$ 19,90</p>
            <p className="text-gray-300">por mês</p>
            <p className="text-sm text-gray-400">
              ou R$ 192,00/ano (economize 20%)
            </p>
          </div>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <Check className="text-purple-300 mt-1 mr-3" size={20} />
              <span className="text-white">Transações ilimitadas</span>
            </li>
            <li className="flex items-start">
              <Check className="text-purple-300 mt-1 mr-3" size={20} />
              <span className="text-white">Relatórios avançados</span>
            </li>
            <li className="flex items-start">
              <Check className="text-purple-300 mt-1 mr-3" size={20} />
              <span className="text-white">Metas e alertas de gasto</span>
            </li>
            <li className="flex items-start">
              <Check className="text-purple-300 mt-1 mr-3" size={20} />
              <span className="text-white">Projeção financeira</span>
            </li>
            <li className="flex items-start">
              <Check className="text-purple-300 mt-1 mr-3" size={20} />
              <span className="text-white">Exportação de dados (PDF/Excel)</span>
            </li>
            <li className="flex items-start">
              <Check className="text-purple-300 mt-1 mr-3" size={20} />
              <span className="text-white">Suporte prioritário</span>
            </li>
          </ul>
          
          <button
            onClick={handleCheckout}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg font-bold hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <Crown className="inline mr-2" size={20} />
            Assinar Plano Pro Agora
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold mb-6 text-center">Perguntas Frequentes</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-bold mb-2">Posso cancelar a qualquer momento?</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Sim, você pode cancelar sua assinatura PRO a qualquer momento. 
              Você continuará com acesso até o final do período já pago.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2">E se eu não gostar do PRO?</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Oferecemos garantia de reembolso de 7 dias. Se não estiver satisfeito, 
              devolvemos seu dinheiro.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Meus dados ficam seguros?</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Sim, utilizamos criptografia de ponta a ponta e não compartilhamos 
              seus dados com terceiros.
            </p>
          </div>
        </div>
      </div>
        <Modal
          isOpen={modal.isOpen}
          onClose={handleOnCloseModal}
          title={modal.title}
          children={modal.text}
      />
    </div>
  )
}

export default PricingPlans