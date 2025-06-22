import { Outlet } from 'react-router-dom'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../components/auth/AuthProvider'
import { Home, AlertTriangle, MapPin, Bell, Settings, LogOut } from 'lucide-react'

const Layout = () => {
  const { user, logout, isDemoMode } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
    { name: 'Sites', href: '/sites', icon: MapPin },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-yellow-500 text-white px-4 py-2 text-center">
          <span className="font-semibold">Demo Mode Active</span> - Using mock data for demonstration
        </div>
      )}
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">NetOp AI</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-indigo-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
            
            {/* User menu */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout 