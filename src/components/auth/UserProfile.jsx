import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { api } from '../../services/api';
import { User, Settings, CreditCard, Bell, Shield, LogOut } from 'lucide-react';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const { showToast, setIsLoading } = useUI();
  const [activeTab, setActiveTab] = useState('account');
  const [subscription, setSubscription] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
    website: ''
  });

  useEffect(() => {
    if (user) {
      // Set initial form data
      setFormData({
        email: user.email,
        name: user.name || '',
        company: user.company || '',
        website: user.website || ''
      });
      
      // Fetch subscription data
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await api.subscription.getUserSubscription(user.userId);
      
      if (error) {
        showToast('Failed to load subscription data', 'error');
        return;
      }
      
      if (data) {
        setSubscription(data);
      }
    } catch (err) {
      showToast('An error occurred while fetching subscription data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
      const { data, error } = await api.auth.updateUserProfile(user.userId, {
        name: formData.name,
        company: formData.company,
        website: formData.website
      });
      
      if (error) {
        showToast('Failed to update profile', 'error');
        return;
      }
      
      if (data) {
        showToast('Profile updated successfully', 'success');
        setIsEditing(false);
      }
    } catch (err) {
      showToast('An error occurred while updating profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
    } catch (err) {
      showToast('Failed to log out', 'error');
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and subscription</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="card">
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => setActiveTab('account')}
                className={`flex items-center space-x-2 p-2 rounded-md text-left ${
                  activeTab === 'account' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Account</span>
              </button>
              
              <button
                onClick={() => setActiveTab('subscription')}
                className={`flex items-center space-x-2 p-2 rounded-md text-left ${
                  activeTab === 'subscription' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Subscription</span>
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center space-x-2 p-2 rounded-md text-left ${
                  activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center space-x-2 p-2 rounded-md text-left ${
                  activeTab === 'security' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Security</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 p-2 rounded-md text-left text-red-500 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="card">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Account Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn btn-outline text-sm py-1 px-3"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className="input w-full bg-muted"
                        disabled
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input w-full"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="input w-full"
                        placeholder="Your company"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="input w-full"
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        className="btn btn-primary px-4 py-2"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Email Address</h3>
                      <p className="text-foreground">{user.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                      <p className="text-foreground">{formData.name || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
                      <p className="text-foreground">{formData.company || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                      <p className="text-foreground">{formData.website || 'Not set'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Account Created</h3>
                      <p className="text-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-6">Subscription</h2>
                
                {subscription ? (
                  <div className="space-y-6">
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">
                          {subscription.planId === 'basic_monthly' ? 'Basic Plan' : 'Pro Plan'}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          subscription.status === 'active' 
                            ? 'bg-accent/10 text-accent' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {subscription.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {subscription.planId === 'basic_monthly' 
                          ? 'Includes 1 campaign per month and basic analytics' 
                          : 'Includes 5 campaigns per month and advanced analytics'}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                        </span>
                        <span className="font-semibold text-foreground">
                          {subscription.planId === 'basic_monthly' ? '$29/month' : '$79/month'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="btn btn-primary px-4 py-2">
                        {subscription.planId === 'basic_monthly' ? 'Upgrade to Pro' : 'Manage Plan'}
                      </button>
                      <button className="btn btn-outline px-4 py-2 text-red-500 border-red-200 hover:bg-red-50">
                        Cancel Subscription
                      </button>
                    </div>
                    
                    <div className="border-t border-border pt-6 mt-6">
                      <h3 className="font-semibold text-foreground mb-4">Billing History</h3>
                      <p className="text-muted-foreground text-sm">No billing history available yet.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Active Subscription</h3>
                    <p className="text-muted-foreground mb-6">
                      You don't have an active subscription yet. Choose a plan to get started.
                    </p>
                    <button className="btn btn-primary px-6 py-2">
                      View Plans
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-6">Notification Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Email Notifications</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-foreground font-medium">Campaign Updates</p>
                          <p className="text-sm text-muted-foreground">Receive updates about your active campaigns</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-foreground font-medium">Performance Reports</p>
                          <p className="text-sm text-muted-foreground">Weekly and monthly performance reports</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-foreground font-medium">Billing Notifications</p>
                          <p className="text-sm text-muted-foreground">Invoices and payment confirmations</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-foreground font-medium">Product Updates</p>
                          <p className="text-sm text-muted-foreground">New features and improvements</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button className="btn btn-primary px-4 py-2">
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Change Password</h3>
                    
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="input w-full"
                          placeholder="••••••••"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="input w-full"
                          placeholder="••••••••"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="input w-full"
                          placeholder="••••••••"
                        />
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="btn btn-primary px-4 py-2"
                        >
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className="border-t border-border pt-6 mt-6">
                    <h3 className="font-semibold text-foreground mb-4">Two-Factor Authentication</h3>
                    
                    <div className="bg-muted p-4 rounded-md mb-4">
                      <p className="text-sm text-muted-foreground">
                        Two-factor authentication adds an extra layer of security to your account.
                      </p>
                    </div>
                    
                    <button className="btn btn-outline px-4 py-2">
                      Enable Two-Factor Authentication
                    </button>
                  </div>
                  
                  <div className="border-t border-border pt-6 mt-6">
                    <h3 className="font-semibold text-red-500 mb-4">Danger Zone</h3>
                    
                    <button className="btn btn-outline px-4 py-2 text-red-500 border-red-200 hover:bg-red-50">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

