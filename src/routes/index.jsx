import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Auth Pages
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import UserProfile from '../components/auth/UserProfile';

// Main App Components
import App from '../App';
import Dashboard from '../components/Dashboard';
import CampaignManager from '../components/CampaignManager';
import InfluencerDiscovery from '../components/InfluencerDiscovery';
import AIStrategist from '../components/AIStrategist';

// Subscription Components
import PlanSelector from '../components/subscription/PlanSelector';
import PaymentForm from '../components/subscription/PaymentForm';

// Workflow Components
import OutreachTemplates from '../components/workflows/OutreachTemplates';
import AutomationRules from '../components/workflows/AutomationRules';
import WorkflowBuilder from '../components/workflows/WorkflowBuilder';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="campaigns" element={<CampaignManager />} />
        <Route path="influencers" element={<InfluencerDiscovery />} />
        <Route path="ai-strategist" element={<AIStrategist />} />
        <Route path="profile" element={<UserProfile />} />
        
        {/* Subscription Routes */}
        <Route path="subscription" element={<PlanSelector />} />
        <Route path="subscription/checkout/:planId" element={<PaymentForm />} />
        
        {/* Workflow Routes */}
        <Route path="campaigns/:campaignId/templates" element={<OutreachTemplates />} />
        <Route path="campaigns/:campaignId/automations" element={<AutomationRules />} />
        <Route path="campaigns/:campaignId/workflows" element={<WorkflowBuilder />} />
      </Route>
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

