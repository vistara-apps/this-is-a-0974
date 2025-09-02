import React from 'react'
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import PerformanceChart from './PerformanceChart'
import RecentCampaigns from './RecentCampaigns'
import TopInfluencers from './TopInfluencers'

const stats = [
  {
    name: 'Total Revenue',
    value: '$12,426',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    name: 'Active Campaigns',
    value: '8',
    change: '+2',
    trend: 'up',
    icon: Target,
  },
  {
    name: 'Total Reach',
    value: '847K',
    change: '+18.2%',
    trend: 'up',
    icon: Users,
  },
  {
    name: 'Engagement Rate',
    value: '4.7%',
    change: '-0.3%',
    trend: 'down',
    icon: TrendingUp,
  },
]

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your campaign overview.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn btn-primary px-4 py-2">
            Create Campaign
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4 text-accent" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ml-1 ${
                stat.trend === 'up' ? 'text-accent' : 'text-red-500'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-muted-foreground ml-1">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        
        {/* Top Influencers */}
        <div>
          <TopInfluencers />
        </div>
      </div>

      {/* Recent Campaigns */}
      <RecentCampaigns />
    </div>
  )
}