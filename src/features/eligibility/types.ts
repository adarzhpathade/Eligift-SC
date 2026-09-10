import { type InferSelectModel } from 'drizzle-orm';
import { schemes } from '@/db/schema';

export type SelectScheme = InferSelectModel<typeof schemes>;

export interface EligibilityInput {
  category: string; // e.g., 'sc'
  annualIncome: number;
  projectCost: number;
  gender?: string;
  age?: number;
  isSafaiKaramchari?: boolean; // SUY scheme specifically targets this
  purpose?: string; // Links to the user's intended loan type from onboarding
}

export type ReasonCode = 
  | 'CATEGORY_MISMATCH'
  | 'INCOME_EXCEEDS_LIMIT'
  | 'PROJECT_COST_TOO_LOW'
  | 'PROJECT_COST_TOO_HIGH'
  | 'AGE_TOO_LOW'
  | 'AGE_TOO_HIGH'
  | 'NOT_SAFAI_KARAMCHARI' // Specific to SUY
  | 'GENDER_MISMATCH';

export interface SchemeMatchResult {
  schemeId: string;
  slug: string;
  title: string;
  isEligible: boolean;
  reasons: ReasonCode[]; 
}

export interface EligibilityResponse {
  isEligible: boolean;
  primaryScheme?: SchemeMatchResult;
  alternatives: SchemeMatchResult[];
}
