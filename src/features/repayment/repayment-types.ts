export interface SchemePolicy {
  minCost?: number | null;
  maxCost?: number | null;
  govtFundingPct: number;
  promoterMarginPct: number;
  interestRateMale: number | null;
  interestRateFemale: number | null;
  minMoratorium: number;
  maxMoratorium: number;
  maxTenureMonths: number;
}

export interface RepaymentInput {
  projectCost: number;
  gender?: string | null;
  selectedMoratoriumMonths: number;
}

export interface FundingBreakdown {
  projectCost: number;
  financedAmount: number;
  promoterMargin: number;
}

export interface Phase1 {
  durationMonths: number;
  interestServicingMonthly: number; // Only interest paid during moratorium
}

export interface Phase2 {
  durationMonths: number;
  emi: number; // Full amortization EMI (Principal + Interest)
}

export interface RepaymentSchedule {
  annualInterestRate: number;
  monthlyInterestRate: number;
  funding: FundingBreakdown;
  phase1: Phase1;
  phase2: Phase2;
}
