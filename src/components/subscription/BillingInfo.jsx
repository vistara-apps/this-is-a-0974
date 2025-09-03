import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { api } from '../../services/api';
import { CreditCard, MapPin } from 'lucide-react';

export default function BillingInfo({ onComplete }) {
  const { user } = useAuth();
  const { setIsLoading, showToast } = useUI();
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    // Format expiry date
    if (name === 'expiryMonth' && value.length > 2) {
      return;
    }
    
    if (name === 'expiryYear' && value.length > 2) {
      return;
    }
    
    // Format CVC
    if (name === 'cvc' && value.length > 4) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would securely send card details to Stripe
      // and only store the payment method ID or customer ID
      
      // For demo purposes, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user with billing address
      const billingAddress = {
        line1: formData.addressLine1,
        line2: formData.addressLine2 || '',
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country
      };
      
      const { error } = await api.auth.updateUserProfile(user.userId, {
        paymentDetails: {
          customerId: `cus_${Math.random().toString(36).substring(2, 15)}`,
          defaultPaymentMethodId: `pm_${Math.random().toString(36).substring(2, 15)}`,
          billingAddress
        }
      });
      
      if (error) {
        showToast('Failed to update billing information', 'error');
        return;
      }
      
      showToast('Billing information saved successfully', 'success');
      
      // Call the onComplete callback to move to the next step
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      showToast('An error occurred while saving billing information', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Billing Information</h2>
        <p className="text-muted-foreground">
          Enter your payment details to complete your subscription
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Information */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-primary" />
            Payment Method
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Name on Card
              </label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                className="input w-full"
                placeholder="John Smith"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="input w-full"
                placeholder="4242 4242 4242 4242"
                required
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Month
                </label>
                <input
                  type="text"
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="MM"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Year
                </label>
                <input
                  type="text"
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="YY"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  CVC
                </label>
                <input
                  type="text"
                  name="cvc"
                  value={formData.cvc}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div className="card">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary" />
            Billing Address
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                className="input w-full"
                placeholder="123 Main St"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="input w-full"
                placeholder="Apt 4B"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="New York"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  State / Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="NY"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="10001"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="btn btn-primary px-6 py-2"
          >
            Save Billing Information
          </button>
        </div>
      </form>
    </div>
  );
}

