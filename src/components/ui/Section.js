import React from 'react';
import classNames from 'classnames';

const Section = ({ 
  children, 
  className = '',
  background = 'white',
  padding = 'default',
  ...props 
}) => {
  const baseClasses = 'relative overflow-hidden';
  
  const backgrounds = {
    white: 'bg-white',
    neutral: 'bg-neutral-50',
    primary: 'bg-primary-50',
    gradient: 'bg-gradient-to-br from-primary-50 via-white to-secondary-50',
    'gradient-dark': 'bg-gradient-to-br from-primary-900 to-secondary-900 text-white',
  };
  
  const paddings = {
    none: '',
    sm: 'py-8 lg:py-12',
    default: 'py-12 lg:py-16',
    lg: 'py-16 lg:py-24',
    xl: 'py-20 lg:py-32',
  };
  
  const classes = classNames(
    baseClasses,
    backgrounds[background],
    paddings[padding],
    className
  );
  
  return (
    <section className={classes} {...props}>
      <div className="section-container relative z-10">
        {children}
      </div>
    </section>
  );
};

export default Section;
