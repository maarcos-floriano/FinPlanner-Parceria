import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Check, Crown, PieChart, Target, Wallet } from "lucide-react"

const LandingPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate();

  const handleNavToAuth = (bool) => {
    let link;
    if (user) {
      link = '/dashboard'; 
    }  else {
      link = '/auth';
    }

    navigate(link, { state: { isLogin: bool } });
  }

  const handleSign = ()=> {
    navigate("/auth");
    window.open(
      "https://pay.kirvano.com/bd353e05-2ba0-4e19-b68b-fd8c6b9ea069",
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div className="fade-in">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Organize seu dinheiro sem dor de cabeça
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
          Use grátis, desbloqueie funções{' '}
          <span className="pro-badge px-2 py-1 rounded text-white text-sm font-bold">
            PRO
          </span>{' '}
          quando quiser
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <button
            onClick={() => handleNavToAuth(false)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center"
          >
            <Wallet className="mr-2" size={20} />
            {user ? 'Ir para Dashboard' : 'Testar grátis sem login'}
          </button>
          <button
            onClick={() => handleNavToAuth(false)}
            className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition flex items-center justify-center"
          >
            <Crown className="mr-2" size={20} />
            Criar conta gratuita
          </button>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Como funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Wallet className="text-blue-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-center">Registre tudo</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Anote receitas e despesas em segundos
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <PieChart className="text-green-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-center">Analise</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Veja gráficos e relatórios claros
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Target className="text-purple-600" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-center">Melhore</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Atinga suas metas financeiras
              </p>
            </div>
          </div>
        </div>
        
        <div id="features" className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Funcionalidades</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-4 text-green-600 flex items-center">
                  <Check className="mr-2" size={20} />
                  Plano GRÁTIS
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="text-green-500 mt-1 mr-2" size={16} />
                    <span>Até 20 transações/mês</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-500 mt-1 mr-2" size={16} />
                    <span>Dashboard básico</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-500 mt-1 mr-2" size={16} />
                    <span>Histórico simples</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-green-500 mt-1 mr-2" size={16} />
                    <span>1 categoria personalizada</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-4 text-purple-600 flex items-center">
                  <Crown className="mr-2" size={20} />
                  Plano PRO
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="text-purple-500 mt-1 mr-2" size={16} />
                    <span>Transações ilimitadas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-purple-500 mt-1 mr-2" size={16} />
                    <span>Relatórios avançados</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-purple-500 mt-1 mr-2" size={16} />
                    <span>Metas e alertas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-purple-500 mt-1 mr-2" size={16} />
                    <span>Exportação de dados</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-purple-500 mt-1 mr-2" size={16} />
                    <span>Categorias ilimitadas</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="text-purple-500 mt-1 mr-2" size={16} />
                    <span>Suporte prioritário</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div id="pricing" className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Planos e Preços</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <h3 className="text-xl font-bold mb-2">Plano Free</h3>
              <p className="text-3xl font-bold mb-4">
                R$ 0<span className="text-sm text-gray-500">/sempre</span>
              </p>
              <Link
                to={user ? '/dashboard' : '/auth'}
                className="w-full py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                {user ? 'Continuar no Free' : 'Usar Grátis'}
              </Link>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-purple-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="pro-badge px-4 py-1 rounded-full text-white text-sm font-bold">
                  RECOMENDADO
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">Plano Pro</h3>
              <p className="text-3xl font-bold mb-1">
                R$ 19,90<span className="text-sm text-gray-500">/mês</span>
              </p>
              <p className="text-sm text-gray-500 mb-4">
                ou R$ 192,00/ano (R$ 16,00/mês)
              </p>
              <button
                onClick={handleSign}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center"
              >
                Assinar Agora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage