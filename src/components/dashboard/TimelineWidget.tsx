import React from 'react';

type TimelineItemProps = {
  timeLabel: string;
  timeLabelColor?: string;
  title: string;
  description: string;
  dotColor: string;
  dotBorderColor: string;
};

const TimelineItem = ({ timeLabel, timeLabelColor = 'text-muted-foreground', title, description, dotColor, dotBorderColor }: TimelineItemProps) => (
  <div className="relative pl-6">
    <div 
      className="absolute w-3 h-3 rounded-full -left-[6.5px] top-1.5 border-2" 
      style={{ backgroundColor: dotColor, borderColor: dotBorderColor }}
    ></div>
    <p className={`text-[12px] font-bold mb-1 ${timeLabelColor}`}>{timeLabel}</p>
    <h4 className="text-[14px] font-semibold text-primary">{title}</h4>
    <p className="text-[14px] text-muted-foreground mt-1">{description}</p>
  </div>
);

export const TimelineWidget = () => {
  return (
    <div className="bg-card/90 backdrop-blur-[10px] border border-border shadow-eg-sm rounded-[20px] transition-all duration-300 hover:-translate-y-1 hover:shadow-eg-hover p-6 flex flex-col flex-1 h-full">
      <h3 className="text-[24px] font-semibold text-primary mb-6">Upcoming Deadlines</h3>
      <div className="relative border-l border-border ml-3 space-y-6 flex-grow">
        
        <TimelineItem 
          timeLabel="In 3 Days (Oct 15)"
          timeLabelColor="text-[#ba1a1a]"
          title="Mudhra Loan Application"
          description="Pending document upload: Last 3 years ITR."
          dotColor="#ba1a1a"
          dotBorderColor="#ffffff"
        />

        <TimelineItem 
          timeLabel="Next Week (Oct 22)"
          title="CGTMSE Guarantee Fee"
          description="Annual renewal payment due."
          dotColor="#FEFECC"
          dotBorderColor="#222222"
        />

        <TimelineItem 
          timeLabel="Next Month (Nov 30)"
          title="ZED Certification Renewal"
          description="Prepare assessment report."
          dotColor="#e4e2e2"
          dotBorderColor="#c4c7c7"
        />

      </div>
    </div>
  );
};
