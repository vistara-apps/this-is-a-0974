// API service that combines all other services
import supabaseService from './supabase';
import openaiService from './openai';
import crewaiService from './crewai';
import stripeService from './stripe';

// Export all services
export const api = {
  // Auth services
  auth: supabaseService.auth,
  
  // Campaign services
  campaigns: supabaseService.campaigns,
  
  // Influencer services
  influencers: supabaseService.influencers,
  
  // Performance metrics services
  metrics: supabaseService.metrics,
  
  // Workflow services
  workflows: supabaseService.workflows,
  
  // AI services
  ai: {
    // OpenAI services
    openai: openaiService,
    
    // CrewAI services
    crewai: crewaiService
  },
  
  // Subscription services
  subscription: stripeService
};

export default api;

