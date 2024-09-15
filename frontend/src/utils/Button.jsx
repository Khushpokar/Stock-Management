import React from 'react';

export const Button = ({ children, variant, size, ...props }) => {
  const baseStyle = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none';
  const variantStyles = {
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-800',
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    // Add more variants as needed
  };
  const sizeStyles = {
    icon: 'p-2',
    default: 'px-4 py-2',
    // Add more sizes if needed
  };

  const className = `${baseStyle} ${variantStyles[variant] || ''} ${sizeStyles[size] || ''}`;

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};
