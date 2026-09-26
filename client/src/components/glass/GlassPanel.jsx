import React from 'react';

export const GlassPanel = ({ children, className = '' }) => (
  <div className={`glass-panel p-8 ${className}`}>
    {children}
  </div>
);
