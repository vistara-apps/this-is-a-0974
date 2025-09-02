import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import CampaignManager from './components/CampaignManager'
import InfluencerDiscovery from './components/InfluencerDiscovery'
import AIStrategist from './components/AIStrategist'

function App() {
  const [activeView, setActiveView] = useState('dashboard')

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'campaigns':
        return <CampaignManager />
      case 'influencers':
        return <InfluencerDiscovery />
      case 'ai-strategist':
        return <AIStrategist />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-auto">
        {renderActiveView()}
      </main>
    </div>
  )
}

export default App