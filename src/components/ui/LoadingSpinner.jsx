import React from 'react';

export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`${className} flex items-center justify-center`}>
      <div className={`${sizeClass} border-t-primary border-r-primary/30 border-b-primary/10 border-l-primary/10 rounded-full animate-spin`}></div>
    </div>
  );
}

