import React from 'react';

export const Input = ({ className, ...props }) => {
  const baseStyle = 'border rounded-md px-3 py-2 focus:ring focus:ring-opacity-50';
  const combinedClassName = `${baseStyle} ${className}`;

  return (
    <input className={combinedClassName} {...props} />
  );
};
