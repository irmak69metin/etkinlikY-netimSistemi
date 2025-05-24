import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { UserInterestProvider } from './contexts/UserInterestContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UserInterestProvider>
        <App />
      </UserInterestProvider>
    </AuthProvider>
  </StrictMode>,
)
