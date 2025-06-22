import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './components/auth/AuthProvider'
import AppRoutes from './pages'

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App 