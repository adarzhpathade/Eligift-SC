import React from 'react';

type BentoGridProps = {
  children: React.ReactNode;
  className?: string;
};

export const BentoGrid = ({ children, className = '' }: BentoGridProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 ${className}`}>
      {children}
    </div>
  );
};
