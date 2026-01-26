import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import LoginForm from '../components/Auth/LoginForm'
import RegisterForm from '../components/Auth/RegisterForm'
import { Crown } from 'lucide-react'

const AuthPage = () => {
  const {state} = useLocation();
  const [isLogin, setIsLogin] = useState(true)

  useEffect(() => {
    if (state?.isLogin !== undefined) {
      setIsLogin(state.isLogin);
    }
  }, [state]);


  return (
    <div className="fade-in">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
            <Crown className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold">FinPlanner</h2>
        </div>
        
        {isLogin ? <LoginForm onToggleForm={() => setIsLogin(false)} /> : <RegisterForm onToggleForm={() => setIsLogin(true)} />}
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Ao criar uma conta, você concorda com nossos{' '}
            <Link to="/terms" className="text-purple-600 hover:underline">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link to="/privacy" className="text-purple-600 hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage