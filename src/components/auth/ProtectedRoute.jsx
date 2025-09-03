import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

export default function ProtectedRoute({ children, requiredSubscription }) {
  const { user, isLoading } = useAuth();
  const { setIsLoading } = useUI();
  const location = useLocation();

  // Show loading state while checking authentication
  React.useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  // If still loading, don't render anything yet
  if (isLoading) {
    return null;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If subscription level is required and user doesn't have it, redirect to upgrade
  if (requiredSubscription && user.subscriptionTier !== requiredSubscription) {
    return <Navigate to="/subscription" state={{ from: location }} replace />;
  }

  // User is authenticated and has required subscription level, render the protected content
  return children;
}

