import { SchemePolicy, RepaymentInput, RepaymentSchedule, FundingBreakdown } from './repayment-types';

/**
 * Calculates the funding breakdown based on project cost and scheme percentages.
 */
export function calculateFunding(
  projectCost: number,
  govtFundingPct: number,
  promoterMarginPct: number
): FundingBreakdown {
  return {
    projectCost,
    financedAmount: (projectCost * govtFundingPct) / 100,
    promoterMargin: (projectCost * promoterMarginPct) / 100,
  };
}

/**
 * Calculates standard amortized EMI.
 * P × r × (1+r)^n / ((1+r)^n - 1)
 */
export function calculateAmortizedEMI(
  principal: number,
  monthlyRate: number,
  tenureMonths: number
): number {
  if (tenureMonths <= 0) return 0;
  if (monthlyRate === 0) return principal / tenureMonths;

  const compoundedRate = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * compoundedRate) / (compoundedRate - 1);
  return emi;
}

/**
 * Core deterministic engine for calculating the two-phase repayment schedule.
 */
export function calculateRepaymentSchedule(
  input: RepaymentInput,
  policy: SchemePolicy
): RepaymentSchedule {
  // 1. Funding Breakdown
  const funding = calculateFunding(
    input.projectCost,
    policy.govtFundingPct,
    policy.promoterMarginPct
  );

  // 2. Determine Interest Rate based on gender
  const isFemale = input.gender?.toLowerCase() === 'female';
  const annualInterestRate =
    (isFemale && policy.interestRateFemale !== null)
      ? policy.interestRateFemale
      : (policy.interestRateMale ?? 0);

  const monthlyInterestRate = annualInterestRate / 12 / 100;

  // 3. Constrain Moratorium
  const safeMoratorium = Math.max(
    policy.minMoratorium,
    Math.min(input.selectedMoratoriumMonths, policy.maxMoratorium)
  );

  // 4. Phase 1: Moratorium (Interest-Only Servicing)
  const phase1Interest = funding.financedAmount * monthlyInterestRate;

  // 5. Phase 2: Amortization
  const phase2Tenure = Math.max(0, policy.maxTenureMonths - safeMoratorium);
  const phase2Emi = calculateAmortizedEMI(funding.financedAmount, monthlyInterestRate, phase2Tenure);

  return {
    annualInterestRate,
    monthlyInterestRate,
    funding,
    phase1: {
      durationMonths: safeMoratorium,
      interestServicingMonthly: phase1Interest,
    },
    phase2: {
      durationMonths: phase2Tenure,
      emi: phase2Emi,
    },
  };
}
