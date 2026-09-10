"use client";

import React, { useState } from 'react';
import { FinancialCalculator } from '@/components/repayment/FinancialCalculator';
import { SchemePolicy } from '@/features/repayment/repayment-types';
import { ChecklistItem } from '@/components/apply/ChecklistItem';
import { GenerateSlipButton } from '@/components/apply/GenerateSlipButton';

type ApplyScheme = {
  id: string;
  title: string;
  description: string;
  ministry: string;
  targetGroup: string;
  endDate: string | null;
  requiredDocuments: string[];
};

type ApplyClientProps = {
  scheme: ApplyScheme;
  policy: SchemePolicy;
  initialProjectCost: number;
  gender: string | null;
};

export function ApplyClient({ scheme, policy, initialProjectCost, gender }: ApplyClientProps) {
  const [projectCost, setProjectCost] = useState(initialProjectCost);
  const [moratorium, setMoratorium] = useState(policy.minMoratorium);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-5 lg:px-16 flex flex-col lg:flex-row gap-8 lg:gap-16">
      
      {/* Left Panel: Context & Requirements (40%) */}
      <aside className="w-full md:w-[40%] flex flex-col gap-6">
        
        {/* Scheme Header Card */}
        <div className="bg-card rounded-[20px] p-6 shadow-[0px_10px_30px_rgba(34,34,34,0.05)] flex flex-col gap-2 border border-border/10">
          <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full w-fit mb-2">
            <span className="material-symbols-outlined text-[16px] text-foreground">account_balance</span>
            <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">{scheme.ministry}</span>
          </div>
          <h1 className="text-[32px] font-semibold text-foreground leading-tight">{scheme.title}</h1>
          <p className="text-[16px] text-muted-foreground mt-2 line-clamp-3">
            {scheme.description}
          </p>
        </div>

        {/* Static Checklist */}
        <div className="bg-card rounded-[20px] p-6 shadow-[0px_10px_30px_rgba(34,34,34,0.05)] flex flex-col gap-3 border border-border/10">
          <h2 className="text-[24px] font-semibold text-foreground mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">inventory_2</span>
            Documents to Carry
          </h2>
          <p className="text-muted-foreground text-[14px] mb-2">
            Please ensure you have physical or digital copies of these documents before visiting the branch.
          </p>
          {scheme.requiredDocuments.length > 0 ? (
            scheme.requiredDocuments.map((doc: string, idx: number) => (
              <ChecklistItem key={idx} label={doc} status="pending" />
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No specific documents required.</p>
          )}
        </div>

      </aside>

      {/* Right Panel: Financial Configuration (60%) */}
      <section className="w-full md:w-[60%] flex flex-col gap-6">
        
        <div className="bg-card rounded-[20px] p-6 sm:p-8 shadow-[0px_10px_30px_rgba(34,34,34,0.05)] border border-border/10">
          <h2 className="text-[28px] font-bold text-foreground mb-6">Finalize Loan Details</h2>
          <FinancialCalculator 
            policy={policy}
            initialProjectCost={initialProjectCost}
            gender={gender}
            projectCost={projectCost}
            onProjectCostChange={setProjectCost}
            moratorium={moratorium}
            onMoratoriumChange={setMoratorium}
          />

          <div className="mt-8 pt-8 border-t border-border/10">
            <div className="bg-primary/5 rounded-[16px] p-6 border border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-[18px] font-semibold text-foreground">Ready to apply?</h3>
                <p className="text-[14px] text-muted-foreground mt-1">
                  Generate your official routing slip to present at the nearest partner branch.
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <GenerateSlipButton 
                  schemeId={scheme.id}
                  defaultProjectCost={projectCost}
                  minMoratorium={moratorium}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>
  )
}
