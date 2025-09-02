import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { 
  Workflow, 
  Plus, 
  ArrowRight, 
  Mail, 
  MessageSquare, 
  DollarSign, 
  CheckCircle,
  Clock,
  AlertCircle,
  Trash,
  Save
} from 'lucide-react';

export default function WorkflowBuilder({ campaignId }) {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const { showToast } = useUI();

  const stepTypes = [
    { id: 'email', name: 'Send Email', icon: Mail },
    { id: 'notification', name: 'Send Notification', icon: MessageSquare },
    { id: 'payment', name: 'Process Payment', icon: DollarSign },
    { id: 'status', name: 'Change Status', icon: CheckCircle },
    { id: 'delay', name: 'Add Delay', icon: Clock }
  ];

  const handleAddStep = (stepType) => {
    const newStep = {
      id: `step-${Date.now()}`,
      type: stepType.id,
      name: stepType.name,
      config: {},
      order: workflowSteps.length
    };
    
    setWorkflowSteps([...workflowSteps, newStep]);
  };

  const handleRemoveStep = (stepId) => {
    setWorkflowSteps(workflowSteps.filter(step => step.id !== stepId));
  };

  const handleStepConfigChange = (stepId, config) => {
    setWorkflowSteps(workflowSteps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          config: {
            ...step.config,
            ...config
          }
        };
      }
      return step;
    }));
  };

  const handleSaveWorkflow = () => {
    if (!workflowName) {
      showToast('Please enter a workflow name', 'error');
      return;
    }
    
    if (workflowSteps.length === 0) {
      showToast('Please add at least one step to the workflow', 'error');
      return;
    }
    
    // In a real app, this would save the workflow to the API
    showToast('Workflow saved successfully', 'success');
    
    // Reset form
    setWorkflowName('');
    setWorkflowSteps([]);
  };

  const renderStepConfig = (step) => {
    switch (step.type) {
      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Template
              </label>
              <select
                value={step.config.templateId || ''}
                onChange={(e) => handleStepConfigChange(step.id, { templateId: e.target.value })}
                className="input w-full"
              >
                <option value="">Select template</option>
                <option value="template-1">Initial Outreach</option>
                <option value="template-2">Follow-up Message</option>
                <option value="template-3">Campaign Brief</option>
              </select>
            </div>
          </div>
        );
        
      case 'notification':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notification Message
              </label>
              <textarea
                value={step.config.message || ''}
                onChange={(e) => handleStepConfigChange(step.id, { message: e.target.value })}
                className="input w-full h-20 resize-none"
                placeholder="Enter notification message..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Recipients
              </label>
              <select
                value={step.config.recipient || ''}
                onChange={(e) => handleStepConfigChange(step.id, { recipient: e.target.value })}
                className="input w-full"
              >
                <option value="">Select recipient</option>
                <option value="team">All Team Members</option>
                <option value="campaign_manager">Campaign Manager</option>
                <option value="influencer">Influencer</option>
              </select>
            </div>
          </div>
        );
        
      case 'payment':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Payment Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="number"
                  value={step.config.amount || ''}
                  onChange={(e) => handleStepConfigChange(step.id, { amount: e.target.value })}
                  className="input pl-10 w-full"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Payment Method
              </label>
              <select
                value={step.config.method || ''}
                onChange={(e) => handleStepConfigChange(step.id, { method: e.target.value })}
                className="input w-full"
              >
                <option value="">Select payment method</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>
          </div>
        );
        
      case 'status':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                New Status
              </label>
              <select
                value={step.config.status || ''}
                onChange={(e) => handleStepConfigChange(step.id, { status: e.target.value })}
                className="input w-full"
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
            </div>
          </div>
        );
        
      case 'delay':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Delay Duration
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    value={step.config.duration || ''}
                    onChange={(e) => handleStepConfigChange(step.id, { duration: e.target.value })}
                    className="input w-full"
                    placeholder="Duration"
                    min="1"
                  />
                </div>
                <div>
                  <select
                    value={step.config.unit || 'days'}
                    onChange={(e) => handleStepConfigChange(step.id, { unit: e.target.value })}
                    className="input w-full"
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              No configuration needed for this step.
            </p>
          </div>
        );
    }
  };

  const getStepIcon = (stepType) => {
    switch (stepType) {
      case 'email':
        return <Mail className="w-5 h-5" />;
      case 'notification':
        return <MessageSquare className="w-5 h-5" />;
      case 'payment':
        return <DollarSign className="w-5 h-5" />;
      case 'status':
        return <CheckCircle className="w-5 h-5" />;
      case 'delay':
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Workflow Builder</h2>
        <button
          onClick={handleSaveWorkflow}
          className="btn btn-primary px-4 py-2"
          disabled={!workflowName || workflowSteps.length === 0}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Workflow
        </button>
      </div>

      {/* Workflow Name */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Workflow className="w-5 h-5 text-primary mr-2" />
          <h3 className="font-semibold text-foreground">Workflow Details</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Workflow Name
          </label>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="input w-full"
            placeholder="e.g., Influencer Onboarding Process"
            required
          />
        </div>
      </div>

      {/* Step Selector */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Plus className="w-5 h-5 text-primary mr-2" />
          <h3 className="font-semibold text-foreground">Add Workflow Steps</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {stepTypes.map((stepType) => (
            <button
              key={stepType.id}
              onClick={() => handleAddStep(stepType)}
              className="flex flex-col items-center justify-center p-4 bg-muted rounded-md hover:bg-muted/80 transition-colors"
            >
              <stepType.icon className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium text-foreground">{stepType.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Workflow Steps */}
      {workflowSteps.length > 0 && (
        <div className="card">
          <div className="flex items-center mb-6">
            <Workflow className="w-5 h-5 text-primary mr-2" />
            <h3 className="font-semibold text-foreground">Workflow Steps</h3>
          </div>
          
          <div className="space-y-8">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Step number indicator */}
                <div className="absolute -left-10 top-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                
                {/* Step content */}
                <div className="border border-border rounded-lg overflow-hidden">
                  {/* Step header */}
                  <div className="flex items-center justify-between bg-muted p-4 border-b border-border">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        {getStepIcon(step.type)}
                      </div>
                      <h4 className="font-medium text-foreground">{step.name}</h4>
                    </div>
                    <button
                      onClick={() => handleRemoveStep(step.id)}
                      className="text-muted-foreground hover:text-red-500"
                      title="Remove step"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Step configuration */}
                  <div className="p-4">
                    {renderStepConfig(step)}
                  </div>
                </div>
                
                {/* Connector arrow */}
                {index < workflowSteps.length - 1 && (
                  <div className="flex justify-center my-4">
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

