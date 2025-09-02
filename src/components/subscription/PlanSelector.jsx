import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { api } from '../../services/api';
import { SUBSCRIPTION_PLANS } from '../../services/stripe';

export default function PlanSelector() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [billingInterval, setBillingInterval] = useState('month');
  const { user } = useAuth();
  const { setIsLoading, showToast } = useUI();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCurrentSubscription();
    }
  }, [user]);

  const fetchCurrentSubscription = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await api.subscription.getUserSubscription(user.userId);
      
      if (error) {
        showToast('Failed to load subscription data', 'error');
        return;
      }
      
      if (data) {
        setCurrentSubscription(data);
        // Set the selected plan based on current subscription
        setSelectedPlan(data.planId);
      }
    } catch (err) {
      showToast('An error occurred while fetching subscription data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || !user) return;
    
    setIsLoading(true);
    
    try {
      // If user already has a subscription, update it
      if (currentSubscription) {
        const { data, error } = await api.subscription.updateSubscription(
          currentSubscription.id,
          selectedPlan
        );
        
        if (error) {
          showToast('Failed to update subscription', 'error');
          return;
        }
        
        if (data) {
          showToast('Subscription updated successfully', 'success');
          navigate('/dashboard');
        }
      } else {
        // Otherwise create a new subscription
        const { data, error } = await api.subscription.createCheckoutSession(
          selectedPlan,
          user.userId
        );
        
        if (error) {
          showToast('Failed to create subscription', 'error');
          return;
        }
        
        if (data) {
          // In a real app, redirect to Stripe checkout
          // window.location.href = data.url;
          
          // For demo, just show success and redirect
          showToast('Subscription created successfully', 'success');
          navigate('/dashboard');
        }
      }
    } catch (err) {
      showToast('An error occurred during subscription process', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter plans based on billing interval
  const filteredPlans = SUBSCRIPTION_PLANS.filter(plan => plan.interval === billingInterval);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the plan that best fits your influencer marketing needs. All plans include our core AI-powered features.
        </p>
      </div>

      {/* Billing Interval Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setBillingInterval('month')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              billingInterval === 'month'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              billingInterval === 'year'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Yearly
            <span className="ml-1 text-xs bg-accent text-white px-1.5 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className={`card hover:shadow-lg transition-shadow cursor-pointer ${
              selectedPlan === plan.id ? 'border-primary ring-2 ring-primary/20' : ''
            }`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground ml-1">/{billingInterval}</span>
                </div>
              </div>
              {selectedPlan === plan.id && (
                <div className="bg-primary text-white p-1 rounded-full">
                  <Check className="w-5 h-5" />
                </div>
              )}
            </div>

            <p className="text-muted-foreground mb-6">
              {plan.name === 'Basic' 
                ? 'Perfect for small businesses just getting started with influencer marketing.' 
                : 'Ideal for growing businesses looking to scale their influencer campaigns.'}
            </p>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-accent mr-2 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlanSelect(plan.id);
                handleSubscribe();
              }}
              className={`w-full py-2 rounded-md ${
                selectedPlan === plan.id
                  ? 'btn btn-primary'
                  : 'btn btn-outline'
              }`}
            >
              {currentSubscription && currentSubscription.planId === plan.id
                ? 'Current Plan'
                : currentSubscription
                  ? 'Switch Plan'
                  : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>

      {/* Money-back Guarantee */}
      <div className="text-center">
        <div className="inline-flex items-center bg-muted px-4 py-2 rounded-full mb-2">
          <CreditCard className="w-4 h-4 text-primary mr-2" />
          <span className="text-sm font-medium">14-day money-back guarantee</span>
        </div>
        <p className="text-sm text-muted-foreground">
          All plans come with a 14-day money-back guarantee. No questions asked.
        </p>
      </div>
    </div>
  );
}

