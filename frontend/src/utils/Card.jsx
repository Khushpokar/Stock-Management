import React from 'react';

// Main Card component
export const Card = ({ children, className, ...props }) => {
  const baseStyle = 'bg-white shadow-md rounded-lg overflow-hidden';
  const combinedClassName = `${baseStyle} ${className}`;

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

// CardHeader component
export const CardHeader = ({ children, className, ...props }) => {
  return (
    <div className={`p-4 border-b ${className}`} {...props}>
      {children}
    </div>
  );
};

// CardContent component
export const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

// CardTitle component
export const CardTitle = ({ children, className, ...props }) => {
  return (
    <h2 className={`text-lg font-semibold ${className}`} {...props}>
      {children}
    </h2>
  );
};
