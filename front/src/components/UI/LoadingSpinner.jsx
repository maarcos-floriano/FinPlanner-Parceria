const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'border-purple-600',
    white: 'border-white',
    gray: 'border-gray-600',
    green: 'border-green-600',
    red: 'border-red-600'
  }

  return (
    <div className={className}>
      <div className={clsx(
        'border-2 border-t-transparent rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color]
      )} />
    </div>
  )
}

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <LoadingSpinner size="xl" color="primary" className="mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
    </div>
  </div>
)

export default LoadingSpinner