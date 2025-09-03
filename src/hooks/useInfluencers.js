import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useUI } from '../context/UIContext';

export default function useInfluencers() {
  const [influencers, setInfluencers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useUI();

  // Fetch all influencers with optional filters
  const fetchInfluencers = async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await api.influencers.getInfluencers(filters);
      
      if (error) {
        setError(error.message);
        showToast('Failed to fetch influencers: ' + error.message, 'error');
        return;
      }
      
      setInfluencers(data || []);
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to fetch influencers: ' + errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a single influencer by ID
  const fetchInfluencer = async (influencerId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await api.influencers.getInfluencer(influencerId);
      
      if (error) {
        setError(error.message);
        showToast('Failed to fetch influencer: ' + error.message, 'error');
        return null;
      }
      
      return data;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to fetch influencer: ' + errorMessage, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Assign influencers to a campaign
  const assignToCampaign = async (influencerIds, campaignId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await api.influencers.assignToCampaign(influencerIds, campaignId);
      
      if (error) {
        setError(error.message);
        showToast('Failed to assign influencers: ' + error.message, 'error');
        return false;
      }
      
      // Update local state
      setInfluencers(influencers.map(influencer => {
        if (influencerIds.includes(influencer.influencerId)) {
          return { ...influencer, campaignId };
        }
        return influencer;
      }));
      
      showToast('Influencers assigned to campaign successfully', 'success');
      return true;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to assign influencers: ' + errorMessage, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Search influencers by keyword
  const searchInfluencers = (keyword, currentInfluencers = influencers) => {
    if (!keyword) return currentInfluencers;
    
    const lowerKeyword = keyword.toLowerCase();
    
    return currentInfluencers.filter(influencer => 
      influencer.name.toLowerCase().includes(lowerKeyword) ||
      influencer.username.toLowerCase().includes(lowerKeyword) ||
      influencer.niche.toLowerCase().includes(lowerKeyword) ||
      influencer.bio.toLowerCase().includes(lowerKeyword)
    );
  };

  // Filter influencers by criteria
  const filterInfluencers = (filters, currentInfluencers = influencers) => {
    return currentInfluencers.filter(influencer => {
      // Filter by niche
      if (filters.niche && filters.niche !== 'All' && influencer.niche !== filters.niche) {
        return false;
      }
      
      // Filter by location
      if (filters.location && filters.location !== 'All' && influencer.location !== filters.location) {
        return false;
      }
      
      // Filter by follower count
      if (filters.followerRange) {
        const [min, max] = filters.followerRange.split('-').map(n => parseInt(n.replace(/[^0-9]/g, ''), 10));
        const followerCount = parseInt(influencer.followerCount.replace(/[^0-9]/g, ''), 10);
        
        if (followerCount < min || (max && followerCount > max)) {
          return false;
        }
      }
      
      // Filter by platform
      if (filters.platform && !influencer.platforms.includes(filters.platform)) {
        return false;
      }
      
      return true;
    });
  };

  // Load influencers on component mount
  useEffect(() => {
    fetchInfluencers();
  }, []);

  return {
    influencers,
    isLoading,
    error,
    fetchInfluencers,
    fetchInfluencer,
    assignToCampaign,
    searchInfluencers,
    filterInfluencers
  };
}

