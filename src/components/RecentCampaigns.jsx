import React from 'react'
import { Calendar, DollarSign, Users, TrendingUp } from 'lucide-react'

const campaigns = [
  {
    id: 1,
    name: 'Summer Fashion Collection',
    status: 'Active',
    budget: '$2,500',
    reach: '45K',
    engagement: '5.2%',
    startDate: '2024-01-15',
    influencers: 3
  },
  {
    id: 2,
    name: 'Tech Product Launch',
    status: 'Completed',
    budget: '$5,000',
    reach: '120K',
    engagement: '6.8%',
    startDate: '2024-01-10',
    influencers: 5
  },
  {
    id: 3,
    name: 'Holiday Food Special',
    status: 'Active',
    budget: '$1,800',
    reach: '32K',
    engagement: '4.9%',
    startDate: '2024-01-20',
    influencers: 2
  },
  {
    id: 4,
    name: 'Fitness Challenge',
    status: 'Planning',
    budget: '$3,200',
    reach: '-',
    engagement: '-',
    startDate: '2024-02-01',
    influencers: 4
  }
]

export default function RecentCampaigns() {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-accent/10 text-accent'
      case 'Completed':
        return 'bg-green-100 text-green-700'
      case 'Planning':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Campaigns</h3>
        <button className="text-sm text-primary hover:text-primary/80">View All</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-sm font-medium text-muted-foreground pb-3">Campaign</th>
              <th className="text-left text-sm font-medium text-muted-foreground pb-3">Status</th>
              <th className="text-left text-sm font-medium text-muted-foreground pb-3">Budget</th>
              <th className="text-left text-sm font-medium text-muted-foreground pb-3">Reach</th>
              <th className="text-left text-sm font-medium text-muted-foreground pb-3">Engagement</th>
              <th className="text-left text-sm font-medium text-muted-foreground pb-3">Influencers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-muted/50">
                <td className="py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{campaign.name}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{campaign.startDate}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-foreground">{campaign.budget}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-foreground">{campaign.reach}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-foreground">{campaign.engagement}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-sm text-foreground">{campaign.influencers}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}