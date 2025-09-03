import React, { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { api } from '../../services/api';
import { Mail, Plus, Edit, Trash, Copy, MessageSquare } from 'lucide-react';

export default function OutreachTemplates({ campaignId }) {
  const [templates, setTemplates] = useState([
    {
      id: 'template-1',
      name: 'Initial Outreach',
      subject: 'Collaboration Opportunity with [Brand Name]',
      body: `Hi [Influencer Name],

I hope this message finds you well! I'm [Your Name] from [Brand Name], and we've been following your content for a while now. We love your authentic approach to [niche/topic] and how you engage with your audience.

We're launching a new [product/campaign] and believe your unique perspective would be a perfect fit for this collaboration. Our [product/campaign] focuses on [brief description], which aligns well with the content you create.

Would you be interested in exploring a potential partnership? We'd love to discuss compensation, deliverables, and timeline at your convenience.

Looking forward to your response!

Best regards,
[Your Name]
[Brand Name]
[Contact Information]`
    },
    {
      id: 'template-2',
      name: 'Follow-up Message',
      subject: 'Following Up: Collaboration with [Brand Name]',
      body: `Hi [Influencer Name],

I wanted to follow up on my previous message about a potential collaboration between you and [Brand Name].

We're still very interested in working with you on our [product/campaign] and would love to hear your thoughts. If you have any questions or need more information before making a decision, please don't hesitate to ask.

Looking forward to connecting with you!

Best regards,
[Your Name]
[Brand Name]
[Contact Information]`
    },
    {
      id: 'template-3',
      name: 'Campaign Brief',
      subject: '[Brand Name] Campaign Brief',
      body: `Hi [Influencer Name],

Thank you for your interest in collaborating with [Brand Name]! I'm excited to share more details about our campaign.

Campaign: [Campaign Name]
Timeline: [Start Date] to [End Date]
Product: [Product Details]

Key Messaging Points:
- [Key Point 1]
- [Key Point 2]
- [Key Point 3]

Deliverables:
- [Deliverable 1, e.g., 1 Instagram Post]
- [Deliverable 2, e.g., 2 Instagram Stories]
- [Deliverable 3, e.g., 1 TikTok Video]

Content Guidelines:
- [Guideline 1]
- [Guideline 2]
- [Guideline 3]

Compensation: [Compensation Details]

Please let me know if this aligns with your content style and if you have any questions or suggestions.

Looking forward to working with you!

Best regards,
[Your Name]
[Brand Name]
[Contact Information]`
    }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const { setIsLoading, showToast } = useUI();

  useEffect(() => {
    if (campaignId) {
      fetchTemplates();
    }
  }, [campaignId]);

  const fetchTemplates = async () => {
    // In a real app, this would fetch templates from the API
    // For now, we'll use the mock data
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app:
      // const { data, error } = await api.workflows.getTemplates(campaignId);
      // if (error) throw new Error(error.message);
      // setTemplates(data);
    } catch (err) {
      showToast('Failed to load templates', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setCurrentTemplate({
      id: '',
      name: '',
      subject: '',
      body: ''
    });
    setIsEditing(false);
    setShowTemplateForm(true);
  };

  const handleEditTemplate = (template) => {
    setCurrentTemplate(template);
    setIsEditing(true);
    setShowTemplateForm(true);
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would delete the template via API
      // For now, we'll just update the local state
      setTemplates(templates.filter(t => t.id !== templateId));
      showToast('Template deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete template', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTemplate = (template) => {
    navigator.clipboard.writeText(template.body);
    showToast('Template copied to clipboard', 'success');
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    
    if (!currentTemplate.name || !currentTemplate.subject || !currentTemplate.body) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would save the template via API
      // For now, we'll just update the local state
      if (isEditing) {
        setTemplates(templates.map(t => 
          t.id === currentTemplate.id ? currentTemplate : t
        ));
        showToast('Template updated successfully', 'success');
      } else {
        const newTemplate = {
          ...currentTemplate,
          id: `template-${Date.now()}`
        };
        setTemplates([...templates, newTemplate]);
        showToast('Template created successfully', 'success');
      }
      
      setShowTemplateForm(false);
    } catch (err) {
      showToast('Failed to save template', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Outreach Templates</h2>
        <button
          onClick={handleCreateTemplate}
          className="btn btn-primary px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </button>
      </div>

      {/* Template List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.subject}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCopyTemplate(template)}
                  className="text-muted-foreground hover:text-foreground"
                  title="Copy template"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="text-muted-foreground hover:text-foreground"
                  title="Edit template"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="text-muted-foreground hover:text-red-500"
                  title="Delete template"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded-md mb-4 max-h-40 overflow-y-auto">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">
                {template.body}
              </pre>
            </div>
            
            <div className="flex justify-end">
              <button className="btn btn-outline text-sm py-1 px-3">
                <MessageSquare className="w-3 h-3 mr-1" />
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Form Modal */}
      {showTemplateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">
                {isEditing ? 'Edit Template' : 'Create Template'}
              </h2>
              <button 
                onClick={() => setShowTemplateForm(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={currentTemplate?.name || ''}
                  onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                  className="input w-full"
                  placeholder="e.g., Initial Outreach"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={currentTemplate?.subject || ''}
                  onChange={(e) => setCurrentTemplate({...currentTemplate, subject: e.target.value})}
                  className="input w-full"
                  placeholder="e.g., Collaboration Opportunity with [Brand Name]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Body
                </label>
                <textarea
                  value={currentTemplate?.body || ''}
                  onChange={(e) => setCurrentTemplate({...currentTemplate, body: e.target.value})}
                  className="input w-full h-64 resize-none"
                  placeholder="Enter your template content here..."
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Use placeholders like [Influencer Name], [Brand Name], etc. for personalization.
                </p>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                <button 
                  type="button"
                  onClick={() => setShowTemplateForm(false)}
                  className="btn btn-outline px-6 py-2"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary px-6 py-2"
                >
                  {isEditing ? 'Update Template' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

