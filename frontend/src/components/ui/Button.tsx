import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center uppercase tracking-widest font-mono font-bold transition-all duration-300 rounded-none cursor-pointer';
  
  const variants = {
    primary: 'bg-black text-white border border-black hover:bg-neutral-900',
    outline: 'bg-transparent text-black border border-black hover:bg-black hover:text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[9px]',
    md: 'px-6 py-3 text-[10px]',
    lg: 'px-8 py-4 text-[11px]',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};