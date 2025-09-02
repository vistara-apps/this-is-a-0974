import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Instagram, 
  Youtube, 
  Twitter, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Star, 
  MessageCircle, 
  UserPlus, 
  X
} from 'lucide-react';
import { useInfluencers } from '../hooks/useInfluencers';
import { useUI } from '../context/UIContext';
import LoadingSpinner from './ui/LoadingSpinner';

export default function InfluencerProfile({ influencerId, onClose }) {
  const [influencer, setInfluencer] = useState(null);
  const { fetchInfluencer, isLoading } = useInfluencers();
  const { showToast } = useUI();

  useEffect(() => {
    const loadInfluencer = async () => {
      const data = await fetchInfluencer(influencerId);
      if (data) {
        setInfluencer(data);
      }
    };
    
    loadInfluencer();
  }, [influencerId]);

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'youtube':
        return <Youtube className="w-5 h-5" />;
      case 'twitter':
        return <Twitter className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-500 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleContactInfluencer = () => {
    showToast('Contact request sent to influencer', 'success');
  };

  const handleAddToCampaign = () => {
    showToast('Influencer added to campaign', 'success');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Influencer Profile</h2>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground">Influencer not found or error loading profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Influencer Profile</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-5xl">
              {influencer.avatar}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{influencer.name}</h3>
                  <p className="text-primary">{influencer.username}</p>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{influencer.location}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-center mb-1">
                    {renderStars(influencer.rating)}
                    <span className="ml-2 text-sm text-muted-foreground">{influencer.rating}</span>
                  </div>
                  <div className="flex space-x-2">
                    {influencer.platforms.map(platform => (
                      <div key={platform} className="text-muted-foreground">
                        {getPlatformIcon(platform)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-foreground mb-2">About</h4>
            <p className="text-muted-foreground">{influencer.bio}</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-foreground">Followers</h5>
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{influencer.followerCount}</p>
              <p className="text-xs text-muted-foreground">Across all platforms</p>
            </div>
            
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-foreground">Engagement Rate</h5>
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">{influencer.engagementRate}</p>
              <p className="text-xs text-muted-foreground">Average across last 10 posts</p>
            </div>
            
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-foreground">Price Range</h5>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">{influencer.priceRange}</p>
              <p className="text-xs text-muted-foreground">Per sponsored post</p>
            </div>
          </div>

          {/* Content Examples */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-foreground mb-4">Recent Content</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-muted aspect-square rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <Instagram className="w-8 h-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audience Demographics */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-foreground mb-4">Audience Demographics</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h5 className="font-medium text-foreground mb-3">Age Distribution</h5>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">18-24</span>
                      <span className="text-foreground">35%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">25-34</span>
                      <span className="text-foreground">45%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">35-44</span>
                      <span className="text-foreground">15%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">45+</span>
                      <span className="text-foreground">5%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h5 className="font-medium text-foreground mb-3">Gender Distribution</h5>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Female</span>
                      <span className="text-foreground">65%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Male</span>
                      <span className="text-foreground">35%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                </div>
                
                <h5 className="font-medium text-foreground mb-3 mt-6">Top Locations</h5>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">United States</span>
                      <span className="text-foreground">45%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">United Kingdom</span>
                      <span className="text-foreground">20%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Canada</span>
                      <span className="text-foreground">15%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-border">
            <button
              onClick={handleContactInfluencer}
              className="btn btn-outline px-4 py-2"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Influencer
            </button>
            <button
              onClick={handleAddToCampaign}
              className="btn btn-primary px-4 py-2"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add to Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

