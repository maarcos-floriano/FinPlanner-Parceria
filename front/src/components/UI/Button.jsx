import { clsx } from 'clsx'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
  
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
    secondary: 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
    gradient: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg',
    'gradient-yellow': 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:shadow-lg'
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Processando...
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default Button