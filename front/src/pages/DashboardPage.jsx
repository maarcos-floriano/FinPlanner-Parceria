import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTransactions } from '../hooks/useTransactions'
import DashboardStats from '../components/Dashboard/DashboardStats'
import TransactionForm from '../components/Dashboard/TransactionForm'
import TransactionList from '../components/Dashboard/TransactionList'
import FinanceChart from '../components/Dashboard/Charts/FinanceChart'
import Icon from '../components/UI/Icon'
import { mockStats, mockTransactions } from '../data/mockData'
import Modal from '../components/UI/Modal'

const DashboardPage = () => {
  const { user, isProUser, loading } = useAuth()
  const navigate = useNavigate()
  const { transactions, fetchTransactions, addTransaction, editTransaction, removeTransaction, fetchDashboard,  } = useTransactions()
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  const [idTransaction, setIdTransaction] = useState(null);
  const [modalAction, setModalAction] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    text: "",
    title: "",
    showActions: false
  });

  // Usar dados mockados para garantir visual idêntico 
  const [localTransactions, setLocalTransactions] = useState(transactions || mockTransactions)
  const [stats, setStats] = useState(mockStats)

  useEffect(() => {
    // Tentar carregar dados reais, mas manter mock como fallback
    const loadData = async () => {
      try {
        await fetchTransactions()
        handleDashboardData();

      } catch (error) {
        console.log('Usando dados mockados para demonstração');
        // Manter dados mockados
      }
    }

    loadData()
  }, [])

  const handleDashboardData = async () => {
    try {
      const data = await fetchDashboard();
      if (data) setStats(data);
      else setStats(mockStats); 
    }  catch {
        console.log('Usando dados mockados para demonstração, Dashboard');
    }
  }


  useEffect(() => {
    setLocalTransactions(transactions);
    handleDashboardData();
  }, [transactions])

  const handleSaveTransaction = async (transactionData) => {
    try {
      if (editingTransaction) {
        // Atualizar transação existente
        const updatedTransactions = localTransactions.map(t => 
          t.id === editingTransaction.id 
            ? { ...transactionData, id: editingTransaction.id }
            : t
        )
        setLocalTransactions(updatedTransactions)
        editTransaction(editingTransaction.id, transactionData);
      } else {
        // Criar nova transação
        const newTransaction = {
          ...transactionData,
          id: Date.now().toString()
        }
        setLocalTransactions([newTransaction, ...localTransactions])
        addTransaction(transactionData);
      }
      
      // Atualizar estatísticas
      updateStats([...localTransactions])
      
      setShowTransactionForm(false)
      setEditingTransaction(null)
      setModal({
          isOpen: true,
          text: "Transação salva com sucesso!",
          title: "Notificação",
          showActions: false
      });
      setTimeout(() => {
        setModal(prev => ({
          ...prev,
          isOpen: false,
          text: "",
          title: "",
        }));
        
      }, 2000);

    } catch (error) {
      alert('Erro ao salvar transação: ' + error.message)
    }
  }

  const updateStats = (transList) => {
    const totalIncome = transList
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    
    const totalExpenses = transList
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    
    setStats({
      monthlyBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      monthTransactionCount: transList.length
    })
  }

  const handleDeleteTransaction = async (transactionId) => {
    setModalAction("delete");
    setIdTransaction(transactionId);
    setModal({
      isOpen: true,
      text: "Tem certeza que deseja excluir esta transação?",
      title: "Confirmação",
      showActions: true
    });
  }

  const handleEditTransaction = (transaction) => {
    setModalAction("edit")
    setEditingTransaction(transaction)
    setShowTransactionForm(true)
  }

  const handleCancelTransaction = () => {
    setShowTransactionForm(false)
    setEditingTransaction(null)
  }

  const monthTransactions = transactions.length || localTransactions.length
  const showFreeLimitWarning = !isProUser &&  monthTransactions >= 15

  const handleOnCloseModal = () => {
    setIdTransaction(null);
    setModal({
      isOpen: false,
      text: "",
      title: "",
      showActions: false
    });
  }


  const handleConfirmModal = () => {
    let updatedTransactions;
    if (modalAction === "delete") {
      
      updatedTransactions = localTransactions.filter(
        t => t.id !== idTransaction
      )
      removeTransaction(idTransaction);
    }

    setLocalTransactions(updatedTransactions)
    updateStats(updatedTransactions)

    if (modalAction === "delete") {
      setModal(prev => ({
          ...prev,
          text: "Transação excluída com sucesso!",
          title: "Notificação",
          showActions: false
      }));
    }

    setIdTransaction(null);
    const timer = setTimeout(() => {
      setModal(prev => ({
        ...prev,
        isOpen: false,
        text: "",
        title: ""
      }));

    }, 2000);

    return () => clearTimeout(timer);
  }

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p id="userGreeting" className="text-gray-600 dark:text-gray-400">
          Olá, {user?.name?.split(' ')[0] || 'Usuário'}!
        </p>
      </div>
      
      {stats && <DashboardStats stats={stats} userPlan={user?.plan} />}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">Visão Geral</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowTransactionForm(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center"
                  id="addTransactionBtn"
                >
                  <Icon name="plus" className="mr-2" />
                  Novo Lançamento
                </button>
                <button
                  onClick={() => navigate('/reports')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center"
                >
                  <Icon name="chart-bar" className="mr-2" />
                  Relatórios
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <FinanceChart transactions={localTransactions} />
            </div>
            
            {showFreeLimitWarning && (
              <div id="freeLimitWarning" className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
                <div className="flex">
                  <Icon name="exclamation-triangle" className="text-yellow-600 mt-1 mr-3" />
                  <div>
                    <p className="font-semibold">Limite do Plano Free</p>
                    <p>
                      Você usou <span id="transactionCount">{monthTransactions}</span> de 20 transações este mês.{' '}
                      <button
                        onClick={() => navigate('/premium')}
                        className="text-purple-600 font-semibold hover:underline"
                      >
                        Assine o PRO
                      </button>{' '}
                      para transações ilimitadas.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {showTransactionForm && (
            <TransactionForm
              onSave={handleSaveTransaction}
              onCancel={handleCancelTransaction}
              editingTransaction={editingTransaction}
            />
          )}
        </div>
        
        <TransactionList
          transactions={localTransactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
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

export default DashboardPage