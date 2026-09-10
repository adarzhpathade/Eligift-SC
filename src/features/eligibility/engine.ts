import { 
  EligibilityInput, 
  EligibilityResponse, 
  ReasonCode, 
  SchemeMatchResult, 
  SelectScheme 
} from './types';

export function evaluateEligibility(
  input: EligibilityInput,
  schemes: SelectScheme[]
): EligibilityResponse {
  const matches: SchemeMatchResult[] = [];

  for (const scheme of schemes) {
    const reasons: ReasonCode[] = [];

    // Category match
    if (input.category.toLowerCase() !== scheme.category.toLowerCase()) {
      reasons.push('CATEGORY_MISMATCH');
    }

    // Income limit check
    if (scheme.incomeLimit !== null) {
      if (input.annualIncome > Number(scheme.incomeLimit)) {
        reasons.push('INCOME_EXCEEDS_LIMIT');
      }
    }

    // Cost checks
    if (scheme.minCost !== null && input.projectCost < Number(scheme.minCost)) {
      reasons.push('PROJECT_COST_TOO_LOW');
    }
    if (scheme.maxCost !== null && input.projectCost > Number(scheme.maxCost)) {
      reasons.push('PROJECT_COST_TOO_HIGH');
    }

    // Age checks
    if (scheme.ageMin !== null && input.age !== undefined && input.age < scheme.ageMin) {
      reasons.push('AGE_TOO_LOW');
    }
    if (scheme.ageMax !== null && input.age !== undefined && input.age > scheme.ageMax) {
      reasons.push('AGE_TOO_HIGH');
    }

    // SUY specific check
    if (scheme.slug === 'suy-swachhta-udyami-yojana' && !input.isSafaiKaramchari) {
      reasons.push('NOT_SAFAI_KARAMCHARI');
    }

    // Gender check for MSY / MAY (Women only schemes)
    if (
      (scheme.slug === 'msy-mahila-samriddhi-yojana' || scheme.slug === 'may-mahila-adhikarita-yojana') &&
      input.gender?.toLowerCase() !== 'female'
    ) {
      reasons.push('GENDER_MISMATCH');
    }

    const isEligible = reasons.length === 0;
    
    matches.push({
      schemeId: scheme.id,
      slug: scheme.slug,
      title: scheme.title,
      isEligible,
      reasons
    });
  }

  const eligibleMatches = matches.filter(m => m.isEligible);
  
  if (eligibleMatches.length === 0) {
    return {
      isEligible: false,
      primaryScheme: undefined,
      alternatives: matches.filter(m => !m.isEligible)
    };
  }

  // Map purpose to slug prefix for ranking
  const purposePrefixMap: Record<string, string> = {
    'small_business': 'mcf',
    'business': 'tls',
    'green_business': 'gbs',
    'education_domestic': 'els-dom',
    'education_abroad': 'els-abr',
    'sanitation': 'suy'
  };

  const rankedSchemes = eligibleMatches.sort((a, b) => {
    // 1. Exact Purpose Match wins first
    if (input.purpose && purposePrefixMap[input.purpose]) {
      const targetPrefix = purposePrefixMap[input.purpose];
      const aMatches = a.slug.startsWith(targetPrefix);
      const bMatches = b.slug.startsWith(targetPrefix);
      if (aMatches && !bMatches) return -1;
      if (bMatches && !aMatches) return 1;
    }

    const schemeA = schemes.find(s => s.id === a.schemeId);
    const schemeB = schemes.find(s => s.id === b.schemeId);
    
    if (!schemeA || !schemeB) return 0;
    
    // Compare interest rates based on gender, defaulting to male if not specified or female
    const rateA = input.gender?.toLowerCase() === 'female' && schemeA.interestRateFemale 
      ? Number(schemeA.interestRateFemale) 
      : (schemeA.interestRateMale ? Number(schemeA.interestRateMale) : 0);
      
    const rateB = input.gender?.toLowerCase() === 'female' && schemeB.interestRateFemale 
      ? Number(schemeB.interestRateFemale) 
      : (schemeB.interestRateMale ? Number(schemeB.interestRateMale) : 0);
      
    if (rateA !== rateB) {
      return rateA - rateB; // Lower is better
    }
    
    // If tie, higher max cost is better
    return (Number(schemeB.maxCost) || 0) - (Number(schemeA.maxCost) || 0);
  });

  return {
    isEligible: true,
    primaryScheme: rankedSchemes[0],
    alternatives: rankedSchemes.slice(1).concat(matches.filter(m => !m.isEligible))
  };
}
