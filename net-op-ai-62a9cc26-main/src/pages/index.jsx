import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../components/auth/AuthProvider'
import Layout from './Layout'
import Home from './Home'
import Incidents from './Incidents'
import Sites from './Sites'
import Notifications from './Notifications'
import Settings from './Settings'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<div>Login Page - Redirect to Auth0</div>} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="incidents" element={<Incidents />} />
        <Route path="sites" element={<Sites />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes 