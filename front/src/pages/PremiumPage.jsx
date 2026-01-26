import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PricingPlans from '../components/Premium/PricingPlans'

const PremiumPage = () => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return (
    <div className="fade-in">
      <PricingPlans />
    </div>
  )
}

export default PremiumPage