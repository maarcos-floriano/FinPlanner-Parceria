import { useEffect, useMemo, useState } from 'react'
import { Search, ShieldCheck, Users, MessageCircle, CreditCard, Activity } from 'lucide-react'
import { getAdminOverview, getAdminUsers, updateAdminUser } from '../services/api'

const planLabel = {
  free: 'Teste',
  essential: 'Essencial',
  whatsapp: 'WhatsApp',
  premium: 'Legado PRO'
}

const Metric = ({ icon: Icon, label, value }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">{label}</p>
      <Icon size={18} className="text-emerald-600" />
    </div>
    <p className="text-2xl font-bold mt-2">{value ?? 0}</p>
  </div>
)

const AdminPage = () => {
  const [metrics, setMetrics] = useState({})
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')
  const [plan, setPlan] = useState('all')
  const [loading, setLoading] = useState(true)

  const filters = useMemo(() => ({ q, plan }), [q, plan])

  const loadData = async () => {
    setLoading(true)
    try {
      const [overviewData, usersData] = await Promise.all([
        getAdminOverview(),
        getAdminUsers(filters)
      ])
      setMetrics(overviewData.metrics || {})
      setUsers(usersData.users || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [filters])

  const handleUserChange = async (userId, data) => {
    await updateAdminUser(userId, data)
    await loadData()
  }

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold mb-2">
            <ShieldCheck size={18} />
            Admin FinPlanner
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Clientes, planos e operacao</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Painel simples para acompanhar assinantes e liberar planos vendidos pela Kirvano.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <Metric icon={Users} label="Usuarios" value={metrics.total_users} />
        <Metric icon={CreditCard} label="Assinantes" value={metrics.active_subscribers} />
        <Metric icon={MessageCircle} label="WhatsApp" value={metrics.whatsapp_users} />
        <Metric icon={Users} label="Novos no mes" value={metrics.new_users_this_month} />
        <Metric icon={Activity} label="Lancamentos" value={metrics.transactions_this_month} />
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              className="w-full pl-10 pr-3 py-2"
              placeholder="Buscar por nome, email ou telefone"
            />
          </div>
          <select value={plan} onChange={(event) => setPlan(event.target.value)} className="px-3 py-2">
            <option value="all">Todos os planos</option>
            <option value="free">Teste</option>
            <option value="essential">Essencial</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading && <p className="p-4 text-gray-500">Carregando clientes...</p>}

          {!loading && users.map((user) => (
            <div key={user.id} className="p-4 grid md:grid-cols-[1fr_auto] gap-4 items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{user.name}</p>
                  {user.is_admin && <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Admin</span>}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {user.phone || 'Sem telefone'} - {planLabel[user.plan] || user.plan} - {user.subscription_status}
                </p>
              </div>

              <div className="grid grid-cols-2 md:flex gap-2">
                <input
                  defaultValue={user.phone || ''}
                  onBlur={(event) => handleUserChange(user.id, { phone: event.target.value })}
                  className="px-3 py-2 text-sm"
                  placeholder="WhatsApp"
                />
                <select
                  value={user.plan}
                  onChange={(event) => handleUserChange(user.id, { plan: event.target.value })}
                  className="px-3 py-2 text-sm"
                >
                  <option value="free">Teste</option>
                  <option value="essential">Essencial</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
            </div>
          ))}

          {!loading && users.length === 0 && (
            <p className="p-4 text-gray-500">Nenhum cliente encontrado.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage
