import { useState } from "react"
import { Link } from "react-router-dom"
import { Check, Crown, ShieldCheck, Mail, AlertCircle } from "lucide-react"
import { usePayment } from "../hooks/usePayments"

const ActivatePro = () => {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

    const { activatePayment } = usePayment(); 

  const handleActivate = async () => {
    if (!code) {
      setError("Informe o código recebido por email")
      return
    }

    setLoading(true)
    setError("")

    try {
      // futuramente:
      const data = await activatePayment(code);

        if (!data.success) {
            console.error(data.message);
        }
        
        setSuccess(data.success)
    } catch (err) {
      setError("Código inválido ou expirado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* HERO */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Crown className="text-yellow-400" />
          Ativar Plano PRO
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Insira o código enviado por email e desbloqueie todos os recursos premium
        </p>
      </div>

      {/* CARD ATIVAÇÃO */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-12 border-2 border-purple-500">
        {success ? (
          <div className="text-center">
            <Crown className="mx-auto mb-4 text-yellow-400" size={48} />
            <h2 className="text-2xl font-bold mb-2">Conta PRO ativada 🎉</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Agora você tem acesso completo a todas as funcionalidades.
            </p>

            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg font-bold hover:shadow-lg transition"
            >
              Ir para o Dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="max-w-md mx-auto">
              <label className="block mb-2 font-semibold">
                Código de ativação
              </label>

              <input
                type="text"
                placeholder="EX: A9F3-2KQ9"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center tracking-widest font-mono text-lg"
              />

              {error && (
                <div className="flex items-center gap-2 text-red-500 mt-3">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleActivate}
                disabled={loading}
                className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-bold hover:shadow-lg transition disabled:opacity-60"
              >
                {loading ? "Ativando..." : "Ativar agora"}
              </button>

              <p className="text-sm text-gray-500 text-center mt-4">
                O código é válido por tempo limitado e pode ser usado apenas uma vez.
              </p>
            </div>
          </>
        )}
      </div>

      {/* BENEFÍCIOS PRO */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold mb-6">O que você desbloqueia no PRO</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <Check className="text-purple-500 mt-1 mr-3" size={20} />
              <span>Transações ilimitadas</span>
            </li>
            <li className="flex items-start">
              <Check className="text-purple-500 mt-1 mr-3" size={20} />
              <span>Relatórios financeiros avançados</span>
            </li>
            <li className="flex items-start">
              <Check className="text-purple-500 mt-1 mr-3" size={20} />
              <span>Metas, alertas e projeções</span>
            </li>
            <li className="flex items-start">
              <Check className="text-purple-500 mt-1 mr-3" size={20} />
              <span>Exportação de dados (PDF e Excel)</span>
            </li>
            <li className="flex items-start">
              <Check className="text-purple-500 mt-1 mr-3" size={20} />
              <span>Suporte prioritário</span>
            </li>
          </ul>
        </div>

        {/* CONFIANÇA */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold mb-6">Ativação segura</h3>

          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="text-green-500 mt-1" />
              <p className="text-gray-600 dark:text-gray-400">
                Seu código é único e validado automaticamente. Nenhuma cobrança
                adicional será feita.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-blue-500 mt-1" />
              <p className="text-gray-600 dark:text-gray-400">
                O código é enviado para o email informado no momento do pagamento.
                Verifique também a caixa de spam.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA SECUNDÁRIO */}
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Ainda não tem um código?
        </p>
        <Link
          to="/pricing"
          className="inline-block px-6 py-3 border-2 border-purple-500 text-purple-600 rounded-lg font-bold hover:bg-purple-50 dark:hover:bg-gray-800 transition"
        >
          Conhecer o Plano PRO
        </Link>
      </div>
    </div>
  )
}

export default ActivatePro
