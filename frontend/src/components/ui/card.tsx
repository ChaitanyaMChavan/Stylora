import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  glass = false,
  hoverEffect = true 
}) => {
  return (
    <div className={`
      border border-black/5 rounded-none p-6 bg-white
      ${glass ? 'backdrop-blur-md bg-white/80 border-white/20' : ''}
      ${hoverEffect ? 'luxury-hover' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};