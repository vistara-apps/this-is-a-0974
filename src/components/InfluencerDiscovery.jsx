import React, { useState } from 'react'
import { Search, Filter, Star, Users, TrendingUp, MapPin, Instagram, Youtube, MessageCircle } from 'lucide-react'

const influencers = [
  {
    id: 1,
    name: 'Sarah Chen',
    username: '@sarahfashion',
    niche: 'Fashion',
    location: 'New York, NY',
    followers: '125K',
    engagement: '6.2%',
    avgViews: '15K',
    rating: 4.8,
    platforms: ['instagram', 'youtube'],
    bio: 'Fashion designer & style enthusiast. Helping women express their unique style.',
    avatar: '👩‍💼',
    priceRange: '$500-1000'
  },
  {
    id: 2,
    name: 'Mike Johnson',
    username: '@techreviewmike',
    niche: 'Technology',
    location: 'San Francisco, CA',
    followers: '89K',
    engagement: '5.8%',
    avgViews: '12K',
    rating: 4.6,
    platforms: ['instagram', 'youtube'],
    bio: 'Tech reviewer & early adopter. Latest gadgets and honest reviews.',
    avatar: '👨‍💻',
    priceRange: '$800-1500'
  },
  {
    id: 3,
    name: 'Emma Wilson',
    username: '@emmyfoodie',
    niche: 'Food & Beverage',
    location: 'Los Angeles, CA',
    followers: '203K',
    engagement: '7.1%',
    avgViews: '25K',
    rating: 4.9,
    platforms: ['instagram'],
    bio: 'Food blogger & recipe creator. Making cooking accessible for everyone.',
    avatar: '👩‍🍳',
    priceRange: '$1000-2000'
  },
  {
    id: 4,
    name: 'Alex Rivera',
    username: '@alexfitness',
    niche: 'Fitness',
    location: 'Miami, FL',
    followers: '156K',
    engagement: '5.9%',
    avgViews: '18K',
    rating: 4.7,
    platforms: ['instagram', 'youtube'],
    bio: 'Certified trainer & nutrition coach. Transform your body and mind.',
    avatar: '🏋️‍♂️',
    priceRange: '$600-1200'
  },
  {
    id: 5,
    name: 'Lily Thompson',
    username: '@lilyglow',
    niche: 'Beauty',
    location: 'Chicago, IL',
    followers: '94K',
    engagement: '6.8%',
    avgViews: '14K',
    rating: 4.5,
    platforms: ['instagram'],
    bio: 'Makeup artist & beauty educator. Tutorials for all skill levels.',
    avatar: '💄',
    priceRange: '$400-800'
  },
  {
    id: 6,
    name: 'David Park',
    username: '@wanderlustdavid',
    niche: 'Travel',
    location: 'Seattle, WA',
    followers: '178K',
    engagement: '5.4%',
    avgViews: '22K',
    rating: 4.8,
    platforms: ['instagram', 'youtube'],
    bio: 'Travel photographer & adventure seeker. Inspiring wanderlust worldwide.',
    avatar: '📸',
    priceRange: '$900-1800'
  }
]

const niches = ['All', 'Fashion', 'Technology', 'Food & Beverage', 'Fitness', 'Beauty', 'Travel']
const locations = ['All', 'New York, NY', 'Los Angeles, CA', 'San Francisco, CA', 'Miami, FL', 'Chicago, IL', 'Seattle, WA']

export default function InfluencerDiscovery() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNiche, setSelectedNiche] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.niche.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesNiche = selectedNiche === 'All' || influencer.niche === selectedNiche
    const matchesLocation = selectedLocation === 'All' || influencer.location === selectedLocation
    
    return matchesSearch && matchesNiche && matchesLocation
  })

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />
      case 'youtube':
        return <Youtube className="w-4 h-4" />
      default:
        return null
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? 'text-yellow-500 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Influencer Discovery</h1>
          <p className="text-muted-foreground">Find the perfect micro-influencers for your campaigns</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button className="btn btn-outline px-4 py-2">
            Saved Influencers
          </button>
          <button className="btn btn-primary px-4 py-2">
            Bulk Contact
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search influencers by name, username, or niche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline px-4 py-2"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Filter Dropdowns */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Niche</label>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="input w-full"
              >
                {niches.map(niche => (
                  <option key={niche} value={niche}>{niche}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="input w-full"
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Followers</label>
              <select className="input w-full">
                <option>All</option>
                <option>10K - 50K</option>
                <option>50K - 100K</option>
                <option>100K - 500K</option>
                <option>500K+</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInfluencers.map((influencer) => (
          <div key={influencer.id} className="card hover:shadow-lg transition-all duration-200">
            {/* Header */}
            <div className="flex items-start space-x-4 mb-4">
              <div className="text-3xl">{influencer.avatar}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground truncate">{influencer.name}</h3>
                <p className="text-sm text-primary">{influencer.username}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{influencer.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  {renderStars(influencer.rating)}
                </div>
                <span className="text-xs text-muted-foreground">{influencer.rating}</span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{influencer.bio}</p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Users className="w-3 h-3 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">{influencer.followers}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">{influencer.engagement}</p>
                <p className="text-xs text-muted-foreground">Engagement</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Star className="w-3 h-3 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">{influencer.avgViews}</p>
                <p className="text-xs text-muted-foreground">Avg Views</p>
              </div>
            </div>

            {/* Niche and Platforms */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {influencer.niche}
              </span>
              <div className="flex items-center space-x-1">
                {influencer.platforms.map(platform => (
                  <div key={platform} className="text-muted-foreground">
                    {getPlatformIcon(platform)}
                  </div>
                ))}
              </div>
            </div>

            {/* Price and Actions */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">{influencer.priceRange}</span>
                <span className="text-xs text-muted-foreground">per post</span>
              </div>
              <div className="flex space-x-2">
                <button className="btn btn-outline flex-1 text-sm py-2">
                  View Profile
                </button>
                <button className="btn btn-primary flex-1 text-sm py-2">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {filteredInfluencers.length > 0 && (
        <div className="text-center pt-6">
          <button className="btn btn-outline px-6 py-2">
            Load More Influencers
          </button>
        </div>
      )}

      {/* No Results */}
      {filteredInfluencers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No influencers found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  )
}