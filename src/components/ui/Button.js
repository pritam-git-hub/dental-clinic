import React from 'react';
import classNames from 'classnames';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  icon,
  iconRight,
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95';
  
  const variants = {
    primary: 'bg-primary-700 hover:bg-primary-800 text-white shadow-soft hover:shadow-soft-lg focus:ring-primary-500 hover:shadow-glow focus:ring-offset-2 focus:ring-2',
    secondary: 'border-2 border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white focus:ring-primary-500 hover:shadow-soft focus:ring-offset-2 focus:ring-2',
    outline: 'border-2 border-neutral-600 text-neutral-800 hover:bg-neutral-600 hover:text-white focus:ring-neutral-500 hover:border-neutral-700 focus:ring-offset-2 focus:ring-2',
    ghost: 'text-neutral-800 hover:bg-neutral-200 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-2',
    link: 'text-primary-700 hover:text-primary-800 underline-offset-4 hover:underline focus:ring-primary-500 p-0 focus:ring-offset-2 focus:ring-2',
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };
  
  const classes = classNames(
    baseClasses,
    variants[variant],
    sizes[size],
    {
      'cursor-not-allowed': disabled,
      'animate-pulse': loading,
    },
    className
  );
  
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
      )}
      {icon && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {iconRight && !loading && (
        <span className="ml-2">{iconRight}</span>
      )}
    </button>
  );
};

export default Button;
