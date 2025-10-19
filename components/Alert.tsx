// Fix: Changed React import from namespace import to default import to fix JSX type errors.
import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
}

export const Alert: React.FC<AlertProps> = React.memo(({ type, message }) => {
  const baseClasses = 'p-4 mb-4 text-sm rounded-lg';
  const typeClasses = {
    success: 'bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400',
    error: 'bg-red-50 text-red-800 dark:bg-gray-800 dark:text-red-400',
    info: 'bg-blue-50 text-blue-800 dark:bg-gray-800 dark:text-blue-400',
  };

  if (!message) return null;

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      {message}
    </div>
  );
});