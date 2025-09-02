import React from 'react'
import { Star, TrendingUp } from 'lucide-react'

const influencers = [
  {
    id: 1,
    name: 'Sarah Chen',
    niche: 'Fashion',
    followers: '125K',
    engagement: '6.2%',
    performance: '+12%',
    avatar: '👩‍💼'
  },
  {
    id: 2,
    name: 'Mike Johnson',
    niche: 'Tech',
    followers: '89K',
    engagement: '5.8%',
    performance: '+8%',
    avatar: '👨‍💻'
  },
  {
    id: 3,
    name: 'Emma Wilson',
    niche: 'Food',
    followers: '203K',
    engagement: '7.1%',
    performance: '+15%',
    avatar: '👩‍🍳'
  },
  {
    id: 4,
    name: 'Alex Rivera',
    niche: 'Fitness',
    followers: '156K',
    engagement: '5.9%',
    performance: '+10%',
    avatar: '🏋️‍♂️'
  }
]

export default function TopInfluencers() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Top Performers</h3>
        <button className="text-sm text-primary hover:text-primary/80">View All</button>
      </div>
      
      <div className="space-y-4">
        {influencers.map((influencer) => (
          <div key={influencer.id} className="flex items-center space-x-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <div className="text-2xl">{influencer.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1 mb-1">
                <p className="text-sm font-medium text-foreground truncate">{influencer.name}</p>
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
              </div>
              <p className="text-xs text-muted-foreground">{influencer.niche} • {influencer.followers}</p>
              <p className="text-xs text-muted-foreground">{influencer.engagement} engagement</p>
            </div>
            <div className="flex items-center space-x-1 text-accent">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-medium">{influencer.performance}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}