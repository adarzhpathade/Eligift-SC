import React from 'react';
import { FundingBreakdown as FundingBreakdownType } from '@/features/repayment/repayment-types';
import { formatCurrency } from '@/lib/utils'; // Assuming this exists or I'll create it
import { FadeIn } from '../ui/motion/fade-in';

interface FundingBreakdownProps {
  funding: FundingBreakdownType;
  govtPct: number;
  promoterPct: number;
}

export function FundingBreakdown({ funding, govtPct, promoterPct }: FundingBreakdownProps) {
  return (
    <FadeIn delay={0.1} className="w-full">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex justify-between items-end mb-1">
          <h4 className="text-[14px] font-semibold text-foreground">Funding Breakdown</h4>
          <span className="text-[12px] font-semibold text-muted-foreground">Total: {formatCurrency(funding.projectCost)}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-muted overflow-hidden flex">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${govtPct}%` }} 
            title="Government Funding"
          />
          <div 
            className="h-full bg-[#B45309] dark:bg-[#F59E0B] transition-all duration-500" 
            style={{ width: `${promoterPct}%` }} 
            title="Promoter Margin"
          />
        </div>
        
        {/* Legend */}
        <div className="flex justify-between mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="flex flex-col">
              <span className="text-[12px] font-medium text-muted-foreground">Govt Funding ({govtPct}%)</span>
              <span className="text-[14px] font-bold text-foreground">{formatCurrency(funding.financedAmount)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#B45309] dark:bg-[#F59E0B]" />
            <div className="flex flex-col text-right">
              <span className="text-[12px] font-medium text-muted-foreground">Your Margin ({promoterPct}%)</span>
              <span className="text-[14px] font-bold text-foreground">{formatCurrency(funding.promoterMargin)}</span>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
