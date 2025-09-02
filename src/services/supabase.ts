import { createClient } from '@supabase/supabase-js';
import type { 
  User, 
  Campaign, 
  Influencer, 
  PerformanceMetric, 
  Workflow,
  ApiResponse
} from '../types';

// Initialize Supabase client
// In a real app, these would be environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth services
export const authService = {
  // Register a new user
  async register(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Create a user profile in the users table
      if (data.user) {
        const newUser = {
          userId: data.user.id,
          email: data.user.email || '',
          subscriptionTier: 'free',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const { error: profileError } = await supabase
          .from('users')
          .insert([newUser]);

        if (profileError) throw profileError;

        return { data: newUser as User };
      }

      return { error: { message: 'Failed to create user' } };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  },

  // Login a user
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user profile from users table
      if (data.user) {
        const { data: userData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('userId', data.user.id)
          .single();

        if (profileError) throw profileError;

        return { data: userData as User };
      }

      return { error: { message: 'Failed to get user data' } };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  },

  // Logout a user
  async logout(): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { data: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  },

  // Get the current user
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      
      if (!authData.user) {
        return { error: { message: 'No user logged in' } };
      }

      const { data: userData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('userId', authData.user.id)
        .single();

      if (profileError) throw profileError;

      return { data: userData as User };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updatedAt: new Date().toISOString() })
        .eq('userId', userId)
        .select()
        .single();

      if (error) throw error;

      return { data: data as User };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  }
};

// Campaign services
export const campaignService = {
  // Create a new campaign
  async createCampaign(campaign: Omit<Campaign, 'campaignId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Campaign>> {
    try {
      const newCampaign = {
        ...campaign,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('campaigns')
        .insert([newCampaign])
        .select()
        .single();

      if (error) throw error;

      return { data: data as Campaign };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  },

  // Get all campaigns for a user
  async getUserCampaigns(userId: string): Promise<ApiResponse<Campaign[]>> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      return { data: data as Campaign[] };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  },

  // Get a campaign by ID
  async getCampaign(campaignId: string): Promise<ApiResponse<Campaign>> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('campaignId', campaignId)
        .single();

      if (error) throw error;

      return { data: data as Campaign };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  },

  // Update a campaign
  async updateCampaign(campaignId: string, updates: Partial<Campaign>): Promise<ApiResponse<Campaign>> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .update({ ...updates, updatedAt: new Date().toISOString() })
        .eq('campaignId', campaignId)
        .select()
        .single();

      if (error) throw error;

      return { data: data as Campaign };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  },

  // Delete a campaign
  async deleteCampaign(campaignId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('campaignId', campaignId);

      if (error) throw error;

      return { data: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  }
};

// Influencer services
export const influencerService = {
  // Get all influencers
  async getInfluencers(filters?: Partial<Influencer>): Promise<ApiResponse<Influencer[]>> {
    try {
      let query = supabase.from('influencers').select('*');

      // Apply filters if provided
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data as Influencer[] };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  },

  // Get an influencer by ID
  async getInfluencer(influencerId: string): Promise<ApiResponse<Influencer>> {
    try {
      const { data, error } = await supabase
        .from('influencers')
        .select('*')
        .eq('influencerId', influencerId)
        .single();

      if (error) throw error;

      return { data: data as Influencer };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  },

  // Assign influencers to a campaign
  async assignToCampaign(influencerIds: string[], campaignId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('influencers')
        .update({ campaignId, updatedAt: new Date().toISOString() })
        .in('influencerId', influencerIds);

      if (error) throw error;

      return { data: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  }
};

// Performance metrics services
export const metricsService = {
  // Get metrics for a campaign
  async getCampaignMetrics(campaignId: string): Promise<ApiResponse<PerformanceMetric[]>> {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('campaignId', campaignId)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return { data: data as PerformanceMetric[] };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  },

  // Add a new metric
  async addMetric(metric: Omit<PerformanceMetric, 'metricId'>): Promise<ApiResponse<PerformanceMetric>> {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .insert([metric])
        .select()
        .single();

      if (error) throw error;

      return { data: data as PerformanceMetric };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  }
};

// Workflow services
export const workflowService = {
  // Create a new workflow
  async createWorkflow(workflow: Omit<Workflow, 'workflowId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Workflow>> {
    try {
      const newWorkflow = {
        ...workflow,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('workflows')
        .insert([newWorkflow])
        .select()
        .single();

      if (error) throw error;

      return { data: data as Workflow };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  },

  // Get workflows for a campaign
  async getCampaignWorkflows(campaignId: string): Promise<ApiResponse<Workflow[]>> {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('campaignId', campaignId);

      if (error) throw error;

      return { data: data as Workflow[] };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  },

  // Update a workflow
  async updateWorkflow(workflowId: string, updates: Partial<Workflow>): Promise<ApiResponse<Workflow>> {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .update({ ...updates, updatedAt: new Date().toISOString() })
        .eq('workflowId', workflowId)
        .select()
        .single();

      if (error) throw error;

      return { data: data as Workflow };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  }
};

export default {
  auth: authService,
  campaigns: campaignService,
  influencers: influencerService,
  metrics: metricsService,
  workflows: workflowService,
};

