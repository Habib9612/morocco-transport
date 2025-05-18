'use client';

import { Loader2 } from 'lucide-react';

interface LoadingProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function Loading({ fullScreen = false, size = 'md', text }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const containerClasses = fullScreen
  ? 'fixed inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-50'    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClasses} role="status" aria-label="Loading">
      <div className="flex flex-col items-center space-y-4">
      <svg className={`${sizeClasses[size]} text-blue-500 animate-spin`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>          className={`${sizeClasses[size]} text-blue-500 animate-spin`}
        />
        {text && (
          <p className="text-sm text-gray-400 animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );
} 