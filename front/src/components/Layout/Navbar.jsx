import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import Icon from '../UI/Icon'
import MobileMenu from './MobileMenu'

const Navbar = () => {
  const { user, isProUser, logout } = useAuth()
  const { darkMode, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleNavToAuth = (bool) => {
    navigate("/auth", { state: { isLogin: bool } });
  }

  return (
    <>
      <nav className="glass-effect sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Icon name="chart-line" className="text-white" />
            </div>
            <Link to="/" className="text-xl font-bold">
              FinPlanner
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/#features" className="hover:text-purple-600 transition">
              Funcionalidades
            </Link>
            <Link to="/#pricing" className="hover:text-purple-600 transition">
              Planos
            </Link>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
              aria-label="Alternar tema"
            >
              {darkMode ? (
                <Icon name="sun" size="lg" />
              ) : (
                <Icon name="moon" size="lg" />
              )}
            </button>
            
            {!user ? (
              <div className="flex space-x-3">
                <button
                  onClick={() => handleNavToAuth(true)}
                  className="px-4 py-2 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50 transition"
                >
                  Entrar
                </button>
                <button
                  onClick={() => handleNavToAuth(false)}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
                >
                  Testar Grátis
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isProUser 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                }`}>
                  {isProUser ? 'PRO' : 'FREE'}
                </span>
                
                <Link to="/dashboard" className="hover:text-purple-600" title="Dashboard">
                  <Icon name="home" size="lg" />
                </Link>
                
                <Link to="/settings" className="hover:text-purple-600" title="Configurações">
                  <Icon name="cog" size="lg" />
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="hover:text-red-500"
                  title="Sair"
                >
                  <Icon name="sign-out-alt" size="lg" />
                </button>
              </div>
            )}
          </div>
          
          <button
            className="md:hidden text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu mobile"
          >
            <Icon name="bars" />
          </button>
        </div>
      </nav>
      
      <MobileMenu 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        isProUser={isProUser}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
    </>
  )
}

export default Navbar