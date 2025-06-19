import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthService from './AuthService';
import { isDemoMode, setDemoMode } from '@/api/entities';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demoMode, setDemoModeState] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if demo mode is enabled
      const demoEnabled = isDemoMode();
      setDemoModeState(demoEnabled);
      
      if (demoEnabled) {
        setIsAuthenticated(true);
        setUser({
          id: 'demo-user-123',
          email: 'demo@netop.cloud',
          full_name: 'Demo User',
          role: 'admin',
          auth_provider: 'demo',
          picture: null
        });
        setIsLoading(false);
        return;
      }
      
      // Initialize Auth0
      await AuthService.initialize();
      
      // Check if user is authenticated
      const authenticated = await AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setError(null);
      await AuthService.loginWithAuth0();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      if (demoMode) {
        setDemoMode(false);
        setDemoModeState(false);
        setUser(null);
        setIsAuthenticated(false);
        // Remove demo parameter from URL
        const url = new URL(window.location);
        url.searchParams.delete('demo');
        window.history.replaceState({}, '', url);
        return;
      }
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
    }
  };

  const getAccessToken = async () => {
    try {
      if (demoMode) {
        return 'demo-token-123';
      }
      return await AuthService.getAccessToken();
    } catch (err) {
      console.error('Get access token error:', err);
      throw err;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    getAccessToken,
    initializeAuth,
    isDemoMode: demoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
export const ProtectedRoute = ({ children, fallback = null }) => {
  const { isAuthenticated, isLoading, login, isDemoMode } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return fallback;
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to NetOp AI</h2>
            <p className="text-gray-600 mb-6">Please sign in to access your network operations dashboard</p>
            
            <div className="space-y-3">
              <button
                onClick={login}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign In with Auth0
              </button>
              
              <button
                onClick={() => {
                  setDemoMode(true);
                  const url = new URL(window.location);
                  url.searchParams.set('demo', 'true');
                  window.location.href = url.toString();
                }}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Try Demo Mode
              </button>
            </div>
            
            {isDemoMode && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Demo mode is active. You can preview the UI without authentication.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return children;
}; 