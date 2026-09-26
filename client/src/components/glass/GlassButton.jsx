import React from 'react';

export const GlassButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  className = '', 
  type = 'button',
  title = ''
}) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed select-none";
  
  const variants = {
    primary: "bg-black text-white border border-black hover:bg-neutral-800 active:bg-neutral-900 shadow-sm",
    secondary: "bg-white text-neutral-900 border border-neutral-200/90 hover:bg-neutral-100 hover:border-neutral-300 shadow-xs",
    ghost: "bg-transparent text-neutral-700 hover:text-black hover:bg-neutral-100",
    danger: "bg-neutral-100 text-red-700 border border-red-200 hover:bg-red-50 hover:border-red-300",
  };

  return (
    <button 
      type={type}
      title={title}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
};
