"use client";

import React, { useState } from 'react';
import { SchemePolicy } from '@/features/repayment/repayment-types';
import { calculateRepaymentSchedule } from '@/features/repayment/emi-engine';
import { FundingBreakdown } from './FundingBreakdown';
import { formatCurrency } from '@/lib/utils';
import { FadeIn } from '../ui/motion/fade-in';
import { useTranslation } from 'react-i18next';

interface FinancialCalculatorProps {
  policy: SchemePolicy;
  initialProjectCost: number;
  gender: string | null;
  projectCost?: number;
  onProjectCostChange?: (cost: number) => void;
  moratorium?: number;
  onMoratoriumChange?: (moratorium: number) => void;
}

export function FinancialCalculator({ 
  policy, 
  initialProjectCost, 
  gender,
  projectCost: controlledProjectCost,
  onProjectCostChange,
  moratorium: controlledMoratorium,
  onMoratoriumChange
}: FinancialCalculatorProps) {
  const { t } = useTranslation();

  // State for interactive sliders (used if uncontrolled)
  const [internalProjectCost, setInternalProjectCost] = useState(initialProjectCost || 50000);
  const [internalMoratorium, setInternalMoratorium] = useState(policy.minMoratorium);

  const projectCost = controlledProjectCost ?? internalProjectCost;
  const moratorium = controlledMoratorium ?? internalMoratorium;

  const handleProjectCostChange = (val: number) => {
    if (onProjectCostChange) onProjectCostChange(val);
    else setInternalProjectCost(val);
  };

  const handleMoratoriumChange = (val: number) => {
    if (onMoratoriumChange) onMoratoriumChange(val);
    else setInternalMoratorium(val);
  };

  // Compute exact values on the fly
  const schedule = calculateRepaymentSchedule(
    {
      projectCost,
      gender,
      selectedMoratoriumMonths: moratorium,
    },
    policy
  );

  return (
    <div className="bg-card rounded-[20px] shadow-[0px_10px_30px_rgba(34,34,34,0.05)] border border-border/10 p-6 flex flex-col gap-6">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <span className="material-symbols-outlined text-primary text-[24px]">calculate</span>
        <h3 className="text-[20px] font-bold text-foreground">{t('calculator.title')}</h3>
      </div>

      {/* Sliders Area */}
      <div className="flex flex-col gap-6">
        {/* Project Cost Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-[14px] font-semibold text-muted-foreground">{t('calculator.projectCost')}</label>
            <span className="text-[16px] font-bold text-foreground">{formatCurrency(projectCost)}</span>
          </div>
          <input
            type="range"
            min={policy.minCost ?? 10000}
            max={policy.maxCost ?? 5000000}
            step={10000}
            value={projectCost}
            onChange={(e) => handleProjectCostChange(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Moratorium Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-[14px] font-semibold text-muted-foreground">{t('calculator.moratoriumPhase')}</label>
            <span className="text-[16px] font-bold text-foreground">{moratorium} {t('calculator.months')}</span>
          </div>
          <input
            type="range"
            min={policy.minMoratorium}
            max={policy.maxMoratorium}
            step={1}
            value={moratorium}
            onChange={(e) => handleMoratoriumChange(Number(e.target.value))}
            disabled={policy.minMoratorium === policy.maxMoratorium}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
          />
        </div>
      </div>

      {/* Visual Breakdown */}
      <FundingBreakdown 
        funding={schedule.funding} 
        govtPct={policy.govtFundingPct} 
        promoterPct={policy.promoterMarginPct} 
      />

      {/* Phase Outputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {/* Phase 1 */}
        <FadeIn delay={0.2} className="h-full">
          <div className="bg-[#FEF3C7]/50 dark:bg-[#F59E0B]/10 rounded-xl p-4 border border-[#F59E0B]/20 dark:border-[#F59E0B]/30 h-full flex flex-col justify-between">
            <div>
              <span className="inline-block px-2 py-1 bg-[#FEF3C7] dark:bg-[#F59E0B]/20 text-[#B45309] dark:text-[#FCD34D] text-[10px] font-bold uppercase rounded-md mb-2">{t('calculator.phase1')}</span>
              <p className="text-[12px] text-muted-foreground dark:text-muted-foreground/80 mb-1">{t('calculator.duration', { months: schedule.phase1.durationMonths })}</p>
              <p className="text-[12px] text-muted-foreground dark:text-muted-foreground/80">{t('calculator.interestOnly')}</p>
            </div>
            <div className="mt-3">
              <span className="text-[24px] font-bold text-[#B45309] dark:text-[#FCD34D]">{formatCurrency(schedule.phase1.interestServicingMonthly)}</span>
              <span className="text-[12px] text-muted-foreground dark:text-muted-foreground/80"> {t('calculator.perMonth')}</span>
            </div>
          </div>
        </FadeIn>

        {/* Phase 2 */}
        <FadeIn delay={0.3} className="h-full">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/20 dark:border-primary/30 h-full flex flex-col justify-between">
            <div>
              <span className="inline-block px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary text-[10px] font-bold uppercase rounded-md mb-2">{t('calculator.phase2')}</span>
              <p className="text-[12px] text-muted-foreground dark:text-muted-foreground/80 mb-1">{t('calculator.duration', { months: schedule.phase2.durationMonths })}</p>
              <p className="text-[12px] text-muted-foreground dark:text-muted-foreground/80">{t('calculator.fullEmi')}</p>
            </div>
            <div className="mt-3">
              <span className="text-[24px] font-bold text-primary">{formatCurrency(schedule.phase2.emi)}</span>
              <span className="text-[12px] text-muted-foreground dark:text-muted-foreground/80"> {t('calculator.perMonth')}</span>
            </div>
          </div>
        </FadeIn>
      </div>
      
      {/* Annual Rate Notice */}
      <div className="text-center mt-2">
        <span className="text-[12px] font-medium text-muted-foreground">
          {t('calculator.calculatedAt', { rate: schedule.annualInterestRate })}
        </span>
      </div>
    </div>
  );
}
