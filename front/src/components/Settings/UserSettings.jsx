import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Download, Mail, Trash2, User } from 'lucide-react'
import Modal from '../UI/Modal'

const UserSettings = () => {
  const { user, isProUser, logout, updateProfile } = useAuth()
  const { darkMode, toggleTheme } = useTheme()
  
  const [modal, setModal] = useState({
    isOpen: false,
    text: "",
    title: "",
    showActions: false
  });
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  const [saving, setSaving] = useState(false)


  const closeModal = () => {
    const timer = setTimeout(() => {
      setModal({
        isOpen: false,
        text: '',
        title: '',
        showActions: false 
      });    
    }, 2000);  
    
    return () => clearTimeout(timer);
  }
  const handleSaveProfile = async () => {
    if (!profileData.name.trim() || !profileData.email.trim()) {
      setModal(prev => ({
        ...prev,
        text: 'Por favor, preencha todos os campos.',
        title: 'Notificação', 
      }));
      closeModal()
      return
    }
    
    setSaving(true)
    try {
      updateProfile(profileData)
      setModal(prev => ({
        ...prev,
        title: "Notificação",
        isOpen: true,
        text: 'Perfil atualizado com sucesso!',
      }));
    } catch (error) {
      setModal(prev => ({
        ...prev,
        isOpen: true,
        title: "Notificação",
        text: 'Erro ao atualizar perfil: ' + error.message,
      }));
    } finally {
      closeModal();
      setSaving(false)
    }
  }

  const handleExportData = () => {
    if (!isProUser) {
      setModal(prev => ({
        ...prev,
        isOpen: true,
        title: "Notificação",
        text: 'A exportação de dados é um recurso exclusivo para usuários PRO.',
      }));
      return
    }
    
    const userData = {
      user,
      exportDate: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(userData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileName = `finplanner_dados_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileName)
    linkElement.click()
    
    setModal(prev => ({
        ...prev,
        isOpen: true,
        title: "Notificação",
        text: 'Seus dados foram exportados com sucesso!',
    }));
    closeModal();

  }

  const handleDeleteAccount = () => {
    setModal({
        showActions: true,
        isOpen: true,
        title: "Confirmação",
        text: 'ATENÇÃO: Esta ação é irreversível!\n\nTem certeza que deseja excluir sua conta e todos os dados associados?',
    });
  }

  const handleConfirmModal = () => {
    setModal(prev => ({
        ...prev,
        title: 'Notificação',
        text: 'Sua conta e todos os dados foram excluídos com sucesso.',
        showActions: false 
    }));    
    logout();
    closeModal();
  }

  const handleOnCloseModal = () => {
    setModal({
        isOpen: false,
        text: '',
        title: '',
        showActions: false 
    });    
  }

  const handleManageSigns = () => {
    setModal({
        isOpen: true,
        title: 'Notificação',
        text: 'Para cancelar, entre em contato com o suporte.',
        showActions: false 
    });    
    closeModal();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Configurações</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie sua conta e preferências
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Seção Perfil */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-6">Perfil</h2>
          
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-bold text-lg">{user?.name || 'Usuário'}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.email || 'usuario@exemplo.com'}
              </p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                isProUser
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
              }`}>
                {isProUser ? 'Plano Pro' : 'Plano Free'}
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nome</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
                  placeholder="Seu nome"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
          </div>
          
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
        
        {/* Seção Plano */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-6">Plano Atual</h2>
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold">
                {isProUser ? 'Plano Pro' : 'Plano Free'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isProUser 
                  ? 'Transações ilimitadas e recursos avançados'
                  : 'Limite de 20 transações/mês'
                }
              </p>
            </div>
            
            {!isProUser ? (
              <a
                href="/premium"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Fazer Upgrade
              </a>
            ) : (
              <button
                onClick={handleManageSigns}
                className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Gerenciar Assinatura
              </button>
            )}
          </div>
        </div>
        
        {/* Seção Preferências */}
        <div className="p-8">
          <h2 className="text-xl font-bold mb-6">Preferências</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Modo Escuro</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Alternar entre tema claro e escuro
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="relative w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors"
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  darkMode ? 'transform translate-x-7' : 'transform translate-x-1'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificações por Email</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receber alertas e resumos semanais
                </p>
              </div>
              <div className="relative w-12 h-6 bg-green-500 rounded-full">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleExportData}
                disabled={!isProUser}
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed mr-4"
              >
                <Download className="inline mr-2" size={18} />
                Exportar Meus Dados
              </button>
              
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <Trash2 className="inline mr-2" size={18} />
                Excluir Conta
              </button>
            </div>
          </div>
        </div>
      </div>
       <Modal
          isOpen={modal.isOpen}
          onClose={handleOnCloseModal}
          title={modal.title}
          children={modal.text}
          showActions={modal.showActions}
          onCancel={handleOnCloseModal}
          onConfirm={handleConfirmModal}
      />
    </div>
  )
}

export default UserSettings