import React from 'react';

export const GlassCard = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`glass-card p-6 ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </div>
);
