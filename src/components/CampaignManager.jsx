import React, { useState } from 'react'
import { Plus, Search, Filter, MoreHorizontal } from 'lucide-react'
import CreateCampaignModal from './CreateCampaignModal'

const campaigns = [
  {
    id: 1,
    name: 'Summer Fashion Collection',
    status: 'Active',
    budget: '$2,500',
    spent: '$1,800',
    reach: '45K',
    engagement: '5.2%',
    influencers: 3,
    startDate: '2024-01-15',
    endDate: '2024-02-15'
  },
  {
    id: 2,
    name: 'Tech Product Launch',
    status: 'Completed',
    budget: '$5,000',
    spent: '$4,850',
    reach: '120K',
    engagement: '6.8%',
    influencers: 5,
    startDate: '2024-01-10',
    endDate: '2024-01-25'
  },
  {
    id: 3,
    name: 'Holiday Food Special',
    status: 'Active',
    budget: '$1,800',
    spent: '$900',
    reach: '32K',
    engagement: '4.9%',
    influencers: 2,
    startDate: '2024-01-20',
    endDate: '2024-02-20'
  }
]

export default function CampaignManager() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-accent/10 text-accent'
      case 'Completed':
        return 'bg-green-100 text-green-700'
      case 'Paused':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getProgressPercentage = (spent, budget) => {
    const spentNum = parseFloat(spent.replace('$', '').replace(',', ''))
    const budgetNum = parseFloat(budget.replace('$', '').replace(',', ''))
    return Math.round((spentNum / budgetNum) * 100)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaign Manager</h1>
          <p className="text-muted-foreground">Create and manage your influencer marketing campaigns</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary px-4 py-2 mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        <button className="btn btn-outline px-4 py-2">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">{campaign.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Budget Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="text-foreground">{campaign.spent} / {campaign.budget}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(campaign.spent, campaign.budget)}%` }}
                  ></div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Reach</p>
                  <p className="text-lg font-semibold text-foreground">{campaign.reach}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                  <p className="text-lg font-semibold text-foreground">{campaign.engagement}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {campaign.startDate} - {campaign.endDate}
                  </span>
                  <span className="text-foreground">
                    {campaign.influencers} influencers
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CreateCampaignModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}