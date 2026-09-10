"use client";

import React, { useState } from 'react';
import { FinancialCalculator } from '@/components/repayment/FinancialCalculator';
import { SchemePolicy } from '@/features/repayment/repayment-types';

interface SchemeInteractiveSectionProps {
  schemeId: string;
  policy: SchemePolicy;
  initialProjectCost: number;
  gender: string | null;
}

export function SchemeInteractiveSection({
  schemeId,
  policy,
  initialProjectCost,
  gender
}: SchemeInteractiveSectionProps) {
  const [projectCost, setProjectCost] = useState(initialProjectCost);
  const [moratorium, setMoratorium] = useState(policy.minMoratorium);

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h2 className="text-[32px] font-semibold text-foreground">EMI Calculator</h2>
        <FinancialCalculator 
          policy={policy}
          initialProjectCost={initialProjectCost}
          gender={gender}
          projectCost={projectCost}
          onProjectCostChange={setProjectCost}
          moratorium={moratorium}
          onMoratoriumChange={setMoratorium}
        />
      </section>
    </div>
  );
}
