import { useState } from 'react';
import { api } from '../services/api';
import { useUI } from '../context/UIContext';

export default function useAIStrategist() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategy, setStrategy] = useState(null);
  const [error, setError] = useState(null);
  const { showToast } = useUI();

  // Generate a campaign strategy using OpenAI
  const generateStrategy = async (businessNiche, targetAudience, campaignGoals, budget) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const { data, error } = await api.ai.openai.generateCampaignStrategy({
        businessNiche,
        targetAudience,
        campaignGoals,
        budget: parseFloat(budget)
      });
      
      if (error) {
        setError(error.message);
        showToast('Failed to generate strategy: ' + error.message, 'error');
        return null;
      }
      
      setStrategy(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to generate strategy: ' + errorMessage, 'error');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate optimization recommendations for a campaign
  const generateOptimizationRecommendations = async (campaignId, performanceData) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const { data, error } = await api.ai.openai.generateOptimizationRecommendations({
        campaignId,
        currentPerformance: performanceData.overall,
        influencerData: performanceData.influencers
      });
      
      if (error) {
        setError(error.message);
        showToast('Failed to generate recommendations: ' + error.message, 'error');
        return null;
      }
      
      return data;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to generate recommendations: ' + errorMessage, 'error');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Launch AI agents for campaign strategy generation
  const launchStrategyAgents = async (businessNiche, targetAudience, campaignGoals, budget) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const { data, error } = await api.ai.crewai.launchStrategyAgents(
        businessNiche,
        targetAudience,
        campaignGoals,
        parseFloat(budget)
      );
      
      if (error) {
        setError(error.message);
        showToast('Failed to launch AI agents: ' + error.message, 'error');
        return null;
      }
      
      return data;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to launch AI agents: ' + errorMessage, 'error');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Save a generated strategy to a campaign
  const saveStrategyToCampaign = async (campaignId, strategy) => {
    try {
      const { data, error } = await api.campaigns.updateCampaign(campaignId, {
        generatedBrief: {
          title: strategy.title,
          sections: strategy.sections,
          createdAt: new Date().toISOString()
        }
      });
      
      if (error) {
        showToast('Failed to save strategy: ' + error.message, 'error');
        return false;
      }
      
      showToast('Strategy saved to campaign successfully', 'success');
      return true;
    } catch (err) {
      showToast('Failed to save strategy: ' + (err.message || 'An unexpected error occurred'), 'error');
      return false;
    }
  };

  return {
    isGenerating,
    strategy,
    error,
    generateStrategy,
    generateOptimizationRecommendations,
    launchStrategyAgents,
    saveStrategyToCampaign
  };
}

