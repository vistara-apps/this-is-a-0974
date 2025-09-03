import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Target, Users } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';
import { useUI } from '../context/UIContext';

export default function EditCampaignModal({ campaignId, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    budget: '',
    startDate: '',
    endDate: '',
    targetAudience: '',
    goals: '',
    status: ''
  });
  
  const { fetchCampaign, updateCampaign, isLoading } = useCampaigns();
  const { showToast } = useUI();

  useEffect(() => {
    const loadCampaign = async () => {
      const campaign = await fetchCampaign(campaignId);
      if (campaign) {
        setFormData({
          name: campaign.name,
          niche: campaign.niche,
          budget: campaign.budget,
          startDate: campaign.startDate.split('T')[0], // Format date for input
          endDate: campaign.endDate.split('T')[0], // Format date for input
          targetAudience: campaign.targetAudience,
          goals: campaign.goals || '',
          status: campaign.status
        });
      }
    };
    
    loadCampaign();
  }, [campaignId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedCampaign = await updateCampaign(campaignId, formData);
    
    if (updatedCampaign) {
      showToast('Campaign updated successfully', 'success');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Edit Campaign</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g., Summer Fashion Collection"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Business Niche
              </label>
              <select
                name="niche"
                value={formData.niche}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="">Select niche</option>
                <option value="fashion">Fashion</option>
                <option value="tech">Technology</option>
                <option value="food">Food & Beverage</option>
                <option value="fitness">Fitness & Health</option>
                <option value="beauty">Beauty & Cosmetics</option>
                <option value="travel">Travel</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Budget
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="input w-full"
                placeholder="5000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Target Audience
              </label>
              <input
                type="text"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g., Women 18-35, Urban"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Target className="w-4 h-4 inline mr-1" />
              Campaign Goals
            </label>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              className="input w-full h-24 resize-none"
              placeholder="Describe your campaign objectives, key messages, and success metrics..."
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-border">
            <button 
              type="button"
              onClick={onClose}
              className="btn btn-outline px-6 py-2"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn btn-primary px-6 py-2"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

