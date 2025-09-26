import React from 'react';
import classNames from 'classnames';

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-colors duration-200';
  
  const variants = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    neutral: 'bg-neutral-100 text-neutral-800',
    outline: 'border border-neutral-300 text-neutral-700',
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  
  const classes = classNames(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );
  
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;
