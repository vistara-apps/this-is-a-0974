import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { SUBSCRIPTION_PLANS } from '../services/stripe';

export default function useSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState(SUBSCRIPTION_PLANS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { showToast } = useUI();

  // Fetch user subscription
  const fetchSubscription = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await api.subscription.getUserSubscription(user.userId);
      
      if (error) {
        setError(error.message);
        showToast('Failed to fetch subscription: ' + error.message, 'error');
        return;
      }
      
      setSubscription(data);
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to fetch subscription: ' + errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch available subscription plans
  const fetchPlans = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await api.subscription.getSubscriptionPlans();
      
      if (error) {
        setError(error.message);
        showToast('Failed to fetch plans: ' + error.message, 'error');
        return;
      }
      
      setPlans(data);
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to fetch plans: ' + errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a checkout session for subscription
  const createCheckoutSession = async (planId) => {
    if (!user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await api.subscription.createCheckoutSession(planId, user.userId);
      
      if (error) {
        setError(error.message);
        showToast('Failed to create checkout session: ' + error.message, 'error');
        return null;
      }
      
      return data;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to create checkout session: ' + errorMessage, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update subscription
  const updateSubscription = async (newPlanId) => {
    if (!user || !subscription) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await api.subscription.updateSubscription(
        subscription.id,
        newPlanId
      );
      
      if (error) {
        setError(error.message);
        showToast('Failed to update subscription: ' + error.message, 'error');
        return false;
      }
      
      setSubscription(data);
      showToast('Subscription updated successfully', 'success');
      return true;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to update subscription: ' + errorMessage, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    if (!user || !subscription) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await api.subscription.cancelSubscription(subscription.id);
      
      if (error) {
        setError(error.message);
        showToast('Failed to cancel subscription: ' + error.message, 'error');
        return false;
      }
      
      setSubscription({ ...subscription, status: data.status });
      showToast('Subscription cancelled successfully', 'success');
      return true;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to cancel subscription: ' + errorMessage, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user can access a feature based on subscription
  const canAccessFeature = (feature) => {
    if (!user) return false;
    
    // Free tier has access to basic features
    if (!subscription || subscription.status !== 'active') {
      return ['dashboard', 'ai_strategy_basic'].includes(feature);
    }
    
    // Get the user's plan
    const userPlan = plans.find(plan => plan.id === subscription.planId);
    if (!userPlan) return false;
    
    // Check feature access based on plan
    switch (feature) {
      case 'dashboard':
      case 'ai_strategy_basic':
        return true;
      case 'campaigns_multiple':
        return userPlan.campaignsLimit > 1;
      case 'advanced_analytics':
        return userPlan.analyticsLevel === 'advanced';
      case 'automated_workflows':
        return userPlan.name.toLowerCase() === 'pro';
      default:
        return false;
    }
  };

  // Get the number of campaigns allowed based on subscription
  const getCampaignsLimit = () => {
    if (!user || !subscription || subscription.status !== 'active') {
      return 1; // Free tier gets 1 campaign
    }
    
    const userPlan = plans.find(plan => plan.id === subscription.planId);
    return userPlan ? userPlan.campaignsLimit : 1;
  };

  // Fetch subscription when user changes
  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
    }
  }, [user]);

  return {
    subscription,
    plans,
    isLoading,
    error,
    fetchSubscription,
    fetchPlans,
    createCheckoutSession,
    updateSubscription,
    cancelSubscription,
    canAccessFeature,
    getCampaignsLimit
  };
}

