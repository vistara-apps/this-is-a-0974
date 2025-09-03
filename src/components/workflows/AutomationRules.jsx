import React, { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { api } from '../../services/api';
import { 
  Zap, 
  Plus, 
  Edit, 
  Trash, 
  Clock, 
  Mail, 
  MessageSquare, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause
} from 'lucide-react';

export default function AutomationRules({ campaignId }) {
  const [automations, setAutomations] = useState([
    {
      id: 'auto-1',
      name: 'Follow-up Reminder',
      description: 'Send a follow-up email if no response within 3 days',
      trigger: 'no_response',
      triggerValue: '3',
      action: 'send_email',
      actionValue: 'template-2',
      status: 'active'
    },
    {
      id: 'auto-2',
      name: 'Campaign Brief',
      description: 'Send campaign brief when influencer accepts collaboration',
      trigger: 'status_change',
      triggerValue: 'accepted',
      action: 'send_email',
      actionValue: 'template-3',
      status: 'active'
    },
    {
      id: 'auto-3',
      name: 'Payment Processing',
      description: 'Process payment when content is approved',
      trigger: 'status_change',
      triggerValue: 'approved',
      action: 'process_payment',
      actionValue: '',
      status: 'paused'
    }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAutomation, setCurrentAutomation] = useState(null);
  const [showAutomationForm, setShowAutomationForm] = useState(false);
  const { setIsLoading, showToast } = useUI();

  const triggerOptions = [
    { value: 'no_response', label: 'No Response' },
    { value: 'status_change', label: 'Status Change' },
    { value: 'date_reached', label: 'Date Reached' }
  ];

  const actionOptions = [
    { value: 'send_email', label: 'Send Email' },
    { value: 'send_notification', label: 'Send Notification' },
    { value: 'process_payment', label: 'Process Payment' },
    { value: 'change_status', label: 'Change Status' }
  ];

  useEffect(() => {
    if (campaignId) {
      fetchAutomations();
    }
  }, [campaignId]);

  const fetchAutomations = async () => {
    // In a real app, this would fetch automations from the API
    // For now, we'll use the mock data
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app:
      // const { data, error } = await api.workflows.getAutomations(campaignId);
      // if (error) throw new Error(error.message);
      // setAutomations(data);
    } catch (err) {
      showToast('Failed to load automation rules', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAutomation = () => {
    setCurrentAutomation({
      id: '',
      name: '',
      description: '',
      trigger: 'no_response',
      triggerValue: '',
      action: 'send_email',
      actionValue: '',
      status: 'active'
    });
    setIsEditing(false);
    setShowAutomationForm(true);
  };

  const handleEditAutomation = (automation) => {
    setCurrentAutomation(automation);
    setIsEditing(true);
    setShowAutomationForm(true);
  };

  const handleDeleteAutomation = async (automationId) => {
    if (!confirm('Are you sure you want to delete this automation rule?')) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would delete the automation via API
      // For now, we'll just update the local state
      setAutomations(automations.filter(a => a.id !== automationId));
      showToast('Automation rule deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete automation rule', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (automationId) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would update the automation via API
      // For now, we'll just update the local state
      setAutomations(automations.map(a => {
        if (a.id === automationId) {
          return {
            ...a,
            status: a.status === 'active' ? 'paused' : 'active'
          };
        }
        return a;
      }));
      
      showToast('Automation status updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update automation status', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAutomation = async (e) => {
    e.preventDefault();
    
    if (!currentAutomation.name || !currentAutomation.description) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would save the automation via API
      // For now, we'll just update the local state
      if (isEditing) {
        setAutomations(automations.map(a => 
          a.id === currentAutomation.id ? currentAutomation : a
        ));
        showToast('Automation rule updated successfully', 'success');
      } else {
        const newAutomation = {
          ...currentAutomation,
          id: `auto-${Date.now()}`
        };
        setAutomations([...automations, newAutomation]);
        showToast('Automation rule created successfully', 'success');
      }
      
      setShowAutomationForm(false);
    } catch (err) {
      showToast('Failed to save automation rule', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getTriggerIcon = (trigger) => {
    switch (trigger) {
      case 'no_response':
        return <Clock className="w-5 h-5" />;
      case 'status_change':
        return <CheckCircle className="w-5 h-5" />;
      case 'date_reached':
        return <Calendar className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'send_email':
        return <Mail className="w-5 h-5" />;
      case 'send_notification':
        return <MessageSquare className="w-5 h-5" />;
      case 'process_payment':
        return <DollarSign className="w-5 h-5" />;
      case 'change_status':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getTriggerDescription = (automation) => {
    switch (automation.trigger) {
      case 'no_response':
        return `After ${automation.triggerValue} days of no response`;
      case 'status_change':
        return `When status changes to "${automation.triggerValue}"`;
      case 'date_reached':
        return `On ${automation.triggerValue}`;
      default:
        return 'Unknown trigger';
    }
  };

  const getActionDescription = (automation) => {
    switch (automation.action) {
      case 'send_email':
        return `Send email using template "${automation.actionValue || 'Any'}"`;
      case 'send_notification':
        return 'Send notification to team';
      case 'process_payment':
        return 'Process payment to influencer';
      case 'change_status':
        return `Change status to "${automation.actionValue}"`;
      default:
        return 'Unknown action';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Automation Rules</h2>
        <button
          onClick={handleCreateAutomation}
          className="btn btn-primary px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Automation
        </button>
      </div>

      {/* Automation List */}
      <div className="space-y-4">
        {automations.map((automation) => (
          <div key={automation.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  automation.status === 'active' 
                    ? 'bg-accent/10 text-accent' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{automation.name}</h3>
                  <p className="text-sm text-muted-foreground">{automation.description}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleStatus(automation.id)}
                  className={`${
                    automation.status === 'active' 
                      ? 'text-accent hover:text-accent/80' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={automation.status === 'active' ? 'Pause automation' : 'Activate automation'}
                >
                  {automation.status === 'active' ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleEditAutomation(automation)}
                  className="text-muted-foreground hover:text-foreground"
                  title="Edit automation"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAutomation(automation.id)}
                  className="text-muted-foreground hover:text-red-500"
                  title="Delete automation"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div className="bg-muted p-3 rounded-md">
                <div className="flex items-center text-sm font-medium text-foreground mb-2">
                  {getTriggerIcon(automation.trigger)}
                  <span className="ml-2">Trigger</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getTriggerDescription(automation)}
                </p>
              </div>
              
              <div className="bg-muted p-3 rounded-md">
                <div className="flex items-center text-sm font-medium text-foreground mb-2">
                  {getActionIcon(automation.action)}
                  <span className="ml-2">Action</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getActionDescription(automation)}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2 text-xs text-muted-foreground">
              <span>
                Status: <span className={automation.status === 'active' ? 'text-accent' : ''}>
                  {automation.status === 'active' ? 'Active' : 'Paused'}
                </span>
              </span>
              <span>
                Last triggered: Never
              </span>
            </div>
          </div>
        ))}
        
        {automations.length === 0 && (
          <div className="text-center py-8">
            <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Automation Rules</h3>
            <p className="text-muted-foreground mb-6">
              Create automation rules to streamline your campaign workflow.
            </p>
            <button
              onClick={handleCreateAutomation}
              className="btn btn-primary px-4 py-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Automation
            </button>
          </div>
        )}
      </div>

      {/* Automation Form Modal */}
      {showAutomationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                {isEditing ? 'Edit Automation Rule' : 'Create Automation Rule'}
              </h2>
              <button 
                onClick={() => setShowAutomationForm(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveAutomation} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Automation Name
                  </label>
                  <input
                    type="text"
                    value={currentAutomation?.name || ''}
                    onChange={(e) => setCurrentAutomation({...currentAutomation, name: e.target.value})}
                    className="input w-full"
                    placeholder="e.g., Follow-up Reminder"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={currentAutomation?.description || ''}
                    onChange={(e) => setCurrentAutomation({...currentAutomation, description: e.target.value})}
                    className="input w-full"
                    placeholder="e.g., Send a follow-up email if no response within 3 days"
                    required
                  />
                </div>
              </div>
              
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">Trigger</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Trigger Type
                    </label>
                    <select
                      value={currentAutomation?.trigger || ''}
                      onChange={(e) => setCurrentAutomation({...currentAutomation, trigger: e.target.value})}
                      className="input w-full"
                      required
                    >
                      {triggerOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {currentAutomation?.trigger === 'no_response' && 'Days Without Response'}
                      {currentAutomation?.trigger === 'status_change' && 'Status Value'}
                      {currentAutomation?.trigger === 'date_reached' && 'Date'}
                      {!currentAutomation?.trigger && 'Trigger Value'}
                    </label>
                    {currentAutomation?.trigger === 'date_reached' ? (
                      <input
                        type="date"
                        value={currentAutomation?.triggerValue || ''}
                        onChange={(e) => setCurrentAutomation({...currentAutomation, triggerValue: e.target.value})}
                        className="input w-full"
                        required
                      />
                    ) : currentAutomation?.trigger === 'status_change' ? (
                      <select
                        value={currentAutomation?.triggerValue || ''}
                        onChange={(e) => setCurrentAutomation({...currentAutomation, triggerValue: e.target.value})}
                        className="input w-full"
                        required
                      >
                        <option value="">Select status</option>
                        <option value="contacted">Contacted</option>
                        <option value="negotiating">Negotiating</option>
                        <option value="accepted">Accepted</option>
                        <option value="declined">Declined</option>
                        <option value="in_progress">In Progress</option>
                        <option value="submitted">Submitted</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      <input
                        type="number"
                        value={currentAutomation?.triggerValue || ''}
                        onChange={(e) => setCurrentAutomation({...currentAutomation, triggerValue: e.target.value})}
                        className="input w-full"
                        placeholder="e.g., 3"
                        min="1"
                        required
                      />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">Action</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Action Type
                    </label>
                    <select
                      value={currentAutomation?.action || ''}
                      onChange={(e) => setCurrentAutomation({...currentAutomation, action: e.target.value})}
                      className="input w-full"
                      required
                    >
                      {actionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {(currentAutomation?.action === 'send_email' || currentAutomation?.action === 'change_status') && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {currentAutomation?.action === 'send_email' ? 'Email Template' : 'New Status'}
                      </label>
                      {currentAutomation?.action === 'send_email' ? (
                        <select
                          value={currentAutomation?.actionValue || ''}
                          onChange={(e) => setCurrentAutomation({...currentAutomation, actionValue: e.target.value})}
                          className="input w-full"
                        >
                          <option value="">Select template</option>
                          <option value="template-1">Initial Outreach</option>
                          <option value="template-2">Follow-up Message</option>
                          <option value="template-3">Campaign Brief</option>
                        </select>
                      ) : (
                        <select
                          value={currentAutomation?.actionValue || ''}
                          onChange={(e) => setCurrentAutomation({...currentAutomation, actionValue: e.target.value})}
                          className="input w-full"
                          required
                        >
                          <option value="">Select status</option>
                          <option value="contacted">Contacted</option>
                          <option value="negotiating">Negotiating</option>
                          <option value="accepted">Accepted</option>
                          <option value="declined">Declined</option>
                          <option value="in_progress">In Progress</option>
                          <option value="submitted">Submitted</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="completed">Completed</option>
                        </select>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-border pt-6">
                <div className="flex items-center mb-4">
                  <input
                    id="active-status"
                    type="checkbox"
                    checked={currentAutomation?.status === 'active'}
                    onChange={(e) => setCurrentAutomation({
                      ...currentAutomation, 
                      status: e.target.checked ? 'active' : 'paused'
                    })}
                    className="h-4 w-4 text-primary border-border rounded"
                  />
                  <label htmlFor="active-status" className="ml-2 block text-sm text-foreground">
                    Activate this automation rule
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                <button 
                  type="button"
                  onClick={() => setShowAutomationForm(false)}
                  className="btn btn-outline px-6 py-2"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary px-6 py-2"
                >
                  {isEditing ? 'Update Automation' : 'Create Automation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

