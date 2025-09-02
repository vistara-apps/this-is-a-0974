import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { api } from '../../services/api';
import { SUBSCRIPTION_PLANS } from '../../services/stripe';
import { CreditCard, Check, Shield } from 'lucide-react';
import BillingInfo from './BillingInfo';

export default function PaymentForm({ planId }) {
  const [step, setStep] = useState('review'); // 'review' or 'billing'
  const { user } = useAuth();
  const { setIsLoading, showToast } = useUI();
  const navigate = useNavigate();

  // Find the selected plan
  const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === planId);

  const handleCompletePayment = async () => {
    if (!selectedPlan || !user) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would create a subscription in Stripe
      // For demo purposes, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user subscription tier
      const { error } = await api.auth.updateUserProfile(user.userId, {
        subscriptionTier: selectedPlan.name.toLowerCase()
      });
      
      if (error) {
        showToast('Failed to update subscription', 'error');
        return;
      }
      
      showToast('Subscription activated successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast('An error occurred during payment processing', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'billing') {
    return <BillingInfo onComplete={() => setStep('review')} />;
  }

  if (!selectedPlan) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">No plan selected. Please select a subscription plan.</p>
        <button
          onClick={() => navigate('/subscription')}
          className="btn btn-primary px-4 py-2 mt-4"
        >
          View Plans
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Complete Your Subscription</h2>
        <p className="text-muted-foreground">
          Review your subscription details before completing your purchase
        </p>
      </div>

      {/* Order Summary */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>
        
        <div className="bg-muted p-4 rounded-md mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-foreground">{selectedPlan.name} Plan</h4>
              <p className="text-sm text-muted-foreground">
                Billed {selectedPlan.interval === 'month' ? 'monthly' : 'annually'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">${selectedPlan.price}</p>
              <p className="text-xs text-muted-foreground">
                per {selectedPlan.interval}
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center">
            <p className="font-medium text-foreground">Total</p>
            <p className="font-bold text-foreground">${selectedPlan.price}/{selectedPlan.interval}</p>
          </div>
        </div>
      </div>

      {/* Plan Features */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Plan Features</h3>
        
        <ul className="space-y-3">
          {selectedPlan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-5 h-5 text-accent mr-2 flex-shrink-0" />
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Method */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-primary" />
          Payment Method
        </h3>
        
        {user?.paymentDetails?.defaultPaymentMethodId ? (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-muted p-2 rounded-md mr-3">
                <CreditCard className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <button
              onClick={() => setStep('billing')}
              className="text-sm text-primary hover:underline"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">No payment method on file</p>
            <button
              onClick={() => setStep('billing')}
              className="btn btn-outline px-4 py-2"
            >
              Add Payment Method
            </button>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="flex items-start space-x-3 mb-6 p-4 bg-muted rounded-md">
        <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-foreground font-medium">Secure Payment Processing</p>
          <p className="text-xs text-muted-foreground">
            Your payment information is encrypted and securely processed. We never store your full card details on our servers.
          </p>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-primary border-border rounded"
            defaultChecked
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-muted-foreground">
            I agree to the{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      {/* Complete Payment Button */}
      <div className="flex justify-end">
        <button
          onClick={handleCompletePayment}
          className="btn btn-primary px-6 py-2"
          disabled={!user?.paymentDetails?.defaultPaymentMethodId}
        >
          Complete Subscription
        </button>
      </div>
    </div>
  );
}

