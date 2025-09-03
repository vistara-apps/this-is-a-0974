import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes'
import { AuthProvider } from './context/AuthContext'
import { UIProvider } from './context/UIContext'
import ErrorBoundary from './components/ui/ErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <UIProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </UIProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)

