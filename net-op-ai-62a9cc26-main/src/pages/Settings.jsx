import { useAuth } from '../components/auth/AuthProvider'
import { User, Mail, Shield } from 'lucide-react'

const Settings = () => {
  const { user, isDemoMode } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {/* User Profile */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Profile</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Name</p>
                    <p className="text-sm text-gray-500">{user?.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">{user?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">User ID</p>
                    <p className="text-sm text-gray-500">{user?.sub || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Authentication Status */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Mode</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isDemoMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {isDemoMode ? 'Demo Mode' : 'Production'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Authenticated
                  </span>
                </div>
              </div>
            </div>

            {/* Demo Mode Notice */}
            {isDemoMode && (
              <div className="border-t pt-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Demo Mode Active
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          You are currently in demo mode. All data is simulated and no real backend operations are performed.
                          To use the full application, configure Auth0 authentication.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings 