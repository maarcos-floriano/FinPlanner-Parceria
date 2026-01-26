import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">FP</span>
              </div>
              <span className="text-xl font-bold">FinPlanner</span>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              © 2023 FinPlanner. Todos os direitos reservados.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">
              Termos de Uso
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">
              Política de Privacidade
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">
              Contato
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer