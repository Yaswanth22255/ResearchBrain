import React from 'react';

export const GlassButton = ({ children, onClick, variant = 'primary', disabled = false, className = '', type = 'button' }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600/90 text-white hover:bg-blue-700 shadow-md hover:shadow-lg backdrop-blur-sm",
    secondary: "bg-white/50 text-gray-800 border border-white/60 hover:bg-white/80 backdrop-blur-sm shadow-sm",
    danger: "bg-red-500/90 text-white hover:bg-red-600 shadow-md backdrop-blur-sm",
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
