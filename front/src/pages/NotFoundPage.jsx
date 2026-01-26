import { Link } from 'react-router-dom'
import Icon from '../components/UI/Icon'

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="exclamation-triangle" className="text-red-600" size="2x" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
          >
            <Icon name="home" className="mr-2" />
            Ir para Home
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center"
          >
            <Icon name="search" className="mr-2" />
            Ir para Dashboard
          </Link>
        </div>
        
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <h3 className="font-bold mb-3">Páginas úteis</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/" className="text-purple-600 hover:underline">Home</Link>
            <Link to="/dashboard" className="text-purple-600 hover:underline">Dashboard</Link>
            <Link to="/reports" className="text-purple-600 hover:underline">Relatórios</Link>
            <Link to="/premium" className="text-purple-600 hover:underline">Planos</Link>
            <Link to="/auth" className="text-purple-600 hover:underline">Login</Link>
            <Link to="/settings" className="text-purple-600 hover:underline">Configurações</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage