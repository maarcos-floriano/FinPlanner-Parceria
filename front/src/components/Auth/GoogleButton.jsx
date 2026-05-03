import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Chrome } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { GOOGLE_CLIENT_ID } from '../../utils/constants'

const GoogleButton = () => {
  const buttonRef = useRef(null)
  const navigate = useNavigate()
  const { loginWithGoogle } = useAuth()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    const loadScript = () => {
      if (window.google?.accounts?.id) {
        setReady(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => setReady(true)
      document.body.appendChild(script)
    }

    loadScript()
  }, [])

  useEffect(() => {
    if (!ready || !buttonRef.current || !window.google?.accounts?.id) return

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async ({ credential }) => {
        const result = await loginWithGoogle(credential)
        if (result.success) navigate('/dashboard')
        else alert(result.error)
      }
    })

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      width: buttonRef.current.offsetWidth || 280,
      text: 'continue_with'
    })
  }, [ready, loginWithGoogle, navigate])

  if (!GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        disabled
        className="w-full py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500 flex items-center justify-center gap-2"
      >
        <Chrome size={18} />
        Google indisponivel
      </button>
    )
  }

  return <div ref={buttonRef} className="w-full min-h-11 flex justify-center" />
}

export default GoogleButton
