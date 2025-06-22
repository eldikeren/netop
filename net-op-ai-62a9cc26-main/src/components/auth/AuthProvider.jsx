import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-spa-js'
import { Auth0Provider } from '@auth0/auth0-spa-js'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const AuthProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for demo mode in URL or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const demoParam = urlParams.get('demo')
    const storedDemoMode = localStorage.getItem('demoMode') === 'true'
    
    if (demoParam === 'true' || storedDemoMode) {
      setIsDemoMode(true)
      localStorage.setItem('demoMode', 'true')
      window.isDemoMode = true
      
      // Set mock user for demo mode
      setUser({
        name: 'Demo User',
        email: 'demo@example.com',
        picture: 'https://via.placeholder.com/40',
        sub: 'demo-user-id'
      })
      setIsLoading(false)
    } else {
      // Clear demo mode if not active
      localStorage.removeItem('demoMode')
      window.isDemoMode = false
    }
  }, [])

  const auth0Config = {
    domain: import.meta.env.VITE_AUTH0_DOMAIN || 'your-domain.auth0.com',
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your-client-id',
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'https://your-api.com'
    }
  }

  const logout = () => {
    if (isDemoMode) {
      localStorage.removeItem('demoMode')
      window.isDemoMode = false
      window.location.href = '/'
    } else {
      // Auth0 logout logic would go here
      window.location.href = '/'
    }
  }

  const value = {
    user,
    isLoading,
    isDemoMode,
    logout,
    isAuthenticated: !!user
  }

  if (isDemoMode) {
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <Auth0Provider {...auth0Config}>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </Auth0Provider>
  )
}

export { AuthProvider } 