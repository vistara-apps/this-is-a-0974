import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

export default function useCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { showToast } = useUI();

  // Fetch all campaigns for the current user
  const fetchCampaigns = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await api.campaigns.getUserCampaigns(user.userId);
      
      if (error) {
        setError(error.message);
        showToast('Failed to fetch campaigns: ' + error.message, 'error');
        return;
      }
      
      setCampaigns(data || []);
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to fetch campaigns: ' + errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a single campaign by ID
  const fetchCampaign = async (campaignId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await api.campaigns.getCampaign(campaignId);
      
      if (error) {
        setError(error.message);
        showToast('Failed to fetch campaign: ' + error.message, 'error');
        return null;
      }
      
      return data;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to fetch campaign: ' + errorMessage, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new campaign
  const createCampaign = async (campaignData) => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newCampaign = {
        ...campaignData,
        userId: user.userId,
        status: 'draft',
        spent: 0
      };
      
      const { data, error } = await api.campaigns.createCampaign(newCampaign);
      
      if (error) {
        setError(error.message);
        showToast('Failed to create campaign: ' + error.message, 'error');
        return null;
      }
      
      // Update local state
      setCampaigns([data, ...campaigns]);
      
      showToast('Campaign created successfully', 'success');
      return data;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to create campaign: ' + errorMessage, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing campaign
  const updateCampaign = async (campaignId, updates) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await api.campaigns.updateCampaign(campaignId, updates);
      
      if (error) {
        setError(error.message);
        showToast('Failed to update campaign: ' + error.message, 'error');
        return null;
      }
      
      // Update local state
      setCampaigns(campaigns.map(campaign => 
        campaign.campaignId === campaignId ? data : campaign
      ));
      
      showToast('Campaign updated successfully', 'success');
      return data;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to update campaign: ' + errorMessage, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a campaign
  const deleteCampaign = async (campaignId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await api.campaigns.deleteCampaign(campaignId);
      
      if (error) {
        setError(error.message);
        showToast('Failed to delete campaign: ' + error.message, 'error');
        return false;
      }
      
      // Update local state
      setCampaigns(campaigns.filter(campaign => campaign.campaignId !== campaignId));
      
      showToast('Campaign deleted successfully', 'success');
      return true;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to delete campaign: ' + errorMessage, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch campaigns when user changes
  useEffect(() => {
    if (user) {
      fetchCampaigns();
    } else {
      setCampaigns([]);
    }
  }, [user]);

  return {
    campaigns,
    isLoading,
    error,
    fetchCampaigns,
    fetchCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign
  };
}

