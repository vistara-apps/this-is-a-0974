import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useUI } from '../context/UIContext';

export default function useWorkflows(campaignId) {
  const [workflows, setWorkflows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useUI();

  // Fetch workflows for a campaign
  const fetchWorkflows = async (id = campaignId) => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await api.workflows.getCampaignWorkflows(id);
      
      if (error) {
        setError(error.message);
        showToast('Failed to fetch workflows: ' + error.message, 'error');
        return;
      }
      
      setWorkflows(data || []);
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to fetch workflows: ' + errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new workflow
  const createWorkflow = async (workflowData) => {
    if (!campaignId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newWorkflow = {
        ...workflowData,
        campaignId
      };
      
      const { data, error } = await api.workflows.createWorkflow(newWorkflow);
      
      if (error) {
        setError(error.message);
        showToast('Failed to create workflow: ' + error.message, 'error');
        return null;
      }
      
      // Update local state
      setWorkflows([...workflows, data]);
      
      showToast('Workflow created successfully', 'success');
      return data;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to create workflow: ' + errorMessage, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing workflow
  const updateWorkflow = async (workflowId, updates) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await api.workflows.updateWorkflow(workflowId, updates);
      
      if (error) {
        setError(error.message);
        showToast('Failed to update workflow: ' + error.message, 'error');
        return null;
      }
      
      // Update local state
      setWorkflows(workflows.map(workflow => 
        workflow.workflowId === workflowId ? data : workflow
      ));
      
      showToast('Workflow updated successfully', 'success');
      return data;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      showToast('Failed to update workflow: ' + errorMessage, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle workflow status (active/paused)
  const toggleWorkflowStatus = async (workflowId) => {
    const workflow = workflows.find(w => w.workflowId === workflowId);
    if (!workflow) return false;
    
    const newStatus = workflow.status === 'active' ? 'paused' : 'active';
    
    return await updateWorkflow(workflowId, { status: newStatus });
  };

  // Fetch workflows when campaignId changes
  useEffect(() => {
    if (campaignId) {
      fetchWorkflows();
    }
  }, [campaignId]);

  return {
    workflows,
    isLoading,
    error,
    fetchWorkflows,
    createWorkflow,
    updateWorkflow,
    toggleWorkflowStatus
  };
}

