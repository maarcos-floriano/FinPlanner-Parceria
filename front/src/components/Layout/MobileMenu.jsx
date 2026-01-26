import { Home, LogOut, Moon, Settings, Sun } from 'lucide-react';
import { Link } from 'react-router-dom'

const MobileMenu = ({ isOpen, onClose, user, isProUser, darkMode, toggleTheme, onLogout }) => {
  if (!isOpen) return null

  return (
    <div className="md:hidden glass-effect border-t border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="flex flex-col space-y-3">
        <Link to="/#features" className="py-2 hover:text-purple-600" onClick={onClose}>
          Funcionalidades
        </Link>
        <Link to="/#pricing" className="py-2 hover:text-purple-600" onClick={onClose}>
          Planos
        </Link>
        
        <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
          {!user ? (
            <div id="mobileAuthButtons">
              <Link
                to="/auth"
                className="w-full mb-2 py-2 rounded-lg border border-purple-600 text-purple-600 block text-center"
                onClick={onClose}
              >
                Entrar
              </Link>
              <Link
                to="/auth"
                className="w-full py-2 rounded-lg bg-purple-600 text-white block text-center"
                onClick={onClose}
              >
                Testar Grátis
              </Link>
            </div>
          ) : (
            <div id="mobileUserMenu">
              <Link
                to="/dashboard"
                className="w-full mb-2 py-2 text-left flex items-center"
                onClick={onClose}
              >
                <Home size={18} className="mr-2" />
                Dashboard
              </Link>
              <Link
                to="/settings"
                className="w-full mb-2 py-2 text-left flex items-center"
                onClick={onClose}
              >
                <Settings size={18} className="mr-2" />
                Configurações
              </Link>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm">Tema</span>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
              <button
                onClick={() => { onLogout(); onClose(); }}
                className="w-full py-2 text-left text-red-500 flex items-center"
              >
                <LogOut size={18} className="mr-2" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MobileMenu