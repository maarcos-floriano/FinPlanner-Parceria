import { clsx } from 'clsx'

const Card = ({ 
  children, 
  className = '',
  padding = 'md',
  hover = false,
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-xl shadow',
        paddingClasses[padding],
        hover && 'hover:shadow-lg transition-shadow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = '' }) => (
  <div className={clsx('mb-4', className)}>
    {children}
  </div>
)

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={clsx('font-bold text-lg', className)}>
    {children}
  </h3>
)

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

export const CardFooter = ({ children, className = '' }) => (
  <div className={clsx('mt-4 pt-4 border-t border-gray-200 dark:border-gray-700', className)}>
    {children}
  </div>
)

export default Card