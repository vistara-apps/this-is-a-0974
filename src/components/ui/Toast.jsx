import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export default function Toast({ id, message, type, duration }) {
  const { removeToast } = useUI();

  useEffect(() => {
    if (duration !== Infinity) {
      const timer = setTimeout(() => {
        removeToast(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, removeToast]);

  const handleClose = () => {
    removeToast(id);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-primary/5 border-primary/20';
    }
  };

  return (
    <div
      className={`flex items-center p-4 mb-3 border rounded-lg shadow-sm animate-fade-in ${getStyles()}`}
      role="alert"
    >
      <div className="mr-3">
        {getIcon()}
      </div>
      <div className="flex-1 text-sm">{message}</div>
      <button
        onClick={handleClose}
        className="ml-3 text-gray-400 hover:text-gray-600"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

