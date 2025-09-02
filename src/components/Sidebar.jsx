import React from 'react'
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  Brain, 
  BarChart3, 
  Settings,
  Crown
} from 'lucide-react'
import { clsx } from 'clsx'

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { name: 'Campaigns', icon: Target, key: 'campaigns' },
  { name: 'Influencers', icon: Users, key: 'influencers' },
  { name: 'AI Strategist', icon: Brain, key: 'ai-strategist' },
  { name: 'Analytics', icon: BarChart3, key: 'analytics' },
  { name: 'Settings', icon: Settings, key: 'settings' },
]

export default function Sidebar({ activeView, setActiveView }) {
  return (
    <div className="w-64 bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-md flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">AdCrafter AI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => setActiveView(item.key)}
                className={clsx(
                  'w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  activeView === item.key
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Subscription Status */}
      <div className="p-4 border-t border-border">
        <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Crown className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Pro Plan</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            5 campaigns remaining this month
          </p>
          <button className="btn btn-primary w-full text-xs py-2">
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  )
}