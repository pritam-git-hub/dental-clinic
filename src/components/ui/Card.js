import React from 'react';
import classNames from 'classnames';

const Card = ({ 
  children, 
  variant = 'default', 
  hover = true,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-xl transition-all duration-200';
  
  const variants = {
    default: 'shadow-soft border border-neutral-100',
    highlight: 'shadow-soft-lg border border-neutral-100 p-8 text-center',
    interactive: 'shadow-soft hover:shadow-soft-lg cursor-pointer border border-neutral-100',
    glass: 'backdrop-blur-sm bg-white/80 shadow-soft border border-white/20',
  };
  
  const hoverEffects = hover ? 'hover:shadow-soft-lg hover:-translate-y-1 hover:scale-[1.02]' : '';
  
  const classes = classNames(
    baseClasses,
    variants[variant],
    hoverEffects,
    {
      'cursor-pointer': onClick,
    },
    className
  );
  
  return (
    <div
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
