import { useEffect } from 'react'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  closeOnOverlayClick = true, 

  showActions = false,
  onCancel,
  onConfirm,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />

        {/* Modal */}
        <div className={clsx(
          'relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full',
          sizeClasses[size]
        )}>
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                aria-label="Fechar modal"
              >
                <X size={24} />
              </button>
            </div>
          )}

          {/* Content */}
          <div className={clsx(
            'p-6',
            !title && 'pt-6'
          )}>
            {children}
          </div>

          {showActions && (
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onCancel || onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-purple-600"
              >
                cancelar
              </button>

              <button
                onClick={onConfirm}
                className={clsx(
                  'px-6 py-2 rounded-lg text-white transition',
                  'bg-purple-600 hover:bg-purple-700'
                )}
              >
                confirmar
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Modal