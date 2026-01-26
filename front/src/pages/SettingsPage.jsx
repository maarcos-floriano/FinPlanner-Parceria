import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import UserSettings from '../components/Settings/UserSettings'

const SettingsPage = () => {
  return (
    <div className="fade-in">
      <UserSettings />
    </div>
  )
}

export default SettingsPage