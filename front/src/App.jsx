import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { TransactionProvider } from './context/TransactionContext'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import ReportsPage from './pages/ReportsPage'
import PremiumPage from './pages/PremiumPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'
import './utils/icons' // Importar ícones
import {PrivateRoute, PublicRoute} from './ConfigRoute'
import ActivatePro from './pages/ActivatePro'
import ForgotPasswordForm from './pages/ForgotPasswordForm'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TransactionProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    
                    <Route path="/" element={
                        <PublicRoute>                  
                          <LandingPage />
                        </PublicRoute>
                    } />
                    <Route path="/auth" element={
                      <PublicRoute>
                        <AuthPage />
                      </PublicRoute>
                    } />
                    <Route path="/forgot-password" element={
                      <PublicRoute>
                        <ForgotPasswordForm />
                      </PublicRoute>
                    } />
                    <Route path="/activate" element={
                      <ActivatePro />
                    } />
                    <Route path="/dashboard" element={
                      <PrivateRoute>
                        <DashboardPage />
                      </PrivateRoute>
                    } />
                    <Route path="/reports" element={
                      <PrivateRoute>
                        <ReportsPage />
                      </PrivateRoute>
                      } />
                    <Route path="/premium" element={
                      <PrivateRoute>
                        <PremiumPage />
                      </PrivateRoute>
                    } />
                    <Route path="/settings" element={
                      <PrivateRoute>
                        <SettingsPage />
                      </PrivateRoute>
                    } />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
        </TransactionProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App