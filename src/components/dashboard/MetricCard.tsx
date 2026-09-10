import React from 'react';

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: string;
  valueColor?: string;
};

import TiltedCard from '../ui/TiltedCard';

export const MetricCard = ({ title, value, icon, valueColor = 'text-primary' }: MetricCardProps) => {
  return (
    <div className="w-full h-full lg:col-span-1">
      <TiltedCard
        containerHeight="100%"
        containerWidth="100%"
        imageHeight="100%"
        imageWidth="100%"
        rotateAmplitude={12}
        scaleOnHover={1.05}
        showMobileWarning={false}
        showTooltip={false}
        displayOverlayContent={true}
        overlayContent={
          <div className="bg-card/90 backdrop-blur-[10px] border border-border shadow-eg-sm rounded-[20px] transition-all duration-300 hover:shadow-eg-hover p-4 md:p-6 flex flex-col justify-between min-h-[140px] w-full h-full">
            <div className="flex justify-between items-start gap-2 relative z-10">
              <span className="text-[10px] md:text-[12px] font-medium text-muted-foreground uppercase tracking-wider line-clamp-2">
                {title}
              </span>
              <span className="material-symbols-outlined text-muted-foreground">{icon}</span>
            </div>
            <div className={`text-[36px] md:text-[48px] font-bold leading-[1.1] tracking-[-0.02em] relative z-10 ${valueColor}`}>
              {value}
            </div>
          </div>
        }
      />
    </div>
  );
};
