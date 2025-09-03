import React, { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { useAuth } from './context/AuthContext'
import { useUI } from './context/UIContext'
import LoadingSpinner from './components/ui/LoadingSpinner'
import Toast from './components/ui/Toast'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const { user, isLoading: authLoading } = useAuth()
  const { isLoading: uiLoading, toasts } = useUI()
  const location = useLocation()
  const navigate = useNavigate()

  // Update active view based on current route
  useEffect(() => {
    const path = location.pathname.split('/')[1]
    if (path) {
      setActiveView(path)
    } else {
      setActiveView('dashboard')
    }
  }, [location])

  // Handle navigation from sidebar
  const handleViewChange = (view) => {
    setActiveView(view)
    navigate(`/${view}`)
  }

  // Show loading spinner while authentication is being checked
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar activeView={activeView} setActiveView={handleViewChange} />
      <main className="flex-1 overflow-auto">
        {/* Loading overlay */}
        {uiLoading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <LoadingSpinner size="lg" className="bg-surface p-6 rounded-lg shadow-lg" />
          </div>
        )}
        
        {/* Toast notifications */}
        <div className="fixed top-4 right-4 z-50 w-80">
          {toasts.map(toast => (
            <Toast key={toast.id} {...toast} />
          ))}
        </div>
        
        {/* Main content */}
        <Outlet />
      </main>
    </div>
  )
}

export default App

