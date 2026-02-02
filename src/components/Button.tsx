import React from 'react';

/**
 * An example button component
 */
export const Button = ({ 
  backgroundColor, 
  size = 'medium', 
  label = 'Button', 
  ...props 
}) => {
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-transparent ${sizeClasses[size]} ${
        backgroundColor 
          ? `bg-${backgroundColor}-600 hover:bg-${backgroundColor}-700 text-white focus:ring-${backgroundColor}-500` 
          : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
      }`}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};