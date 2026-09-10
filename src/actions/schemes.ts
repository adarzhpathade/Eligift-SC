'use server'

import { getAuthUser } from '@/lib/auth-cache'
import { db } from '@/db'
import { profiles, schemes } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { evaluateEligibility, EligibilityInput } from '@/features/eligibility'
import { getUserAttributes, computeMatchScore } from '@/services/recommendation'

export async function getRecommendedSchemes() {
  const user = await getAuthUser()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    // 1. Fetch user profile
    const profileData = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id)
    });

    if (!profileData) {
      return { success: true, data: [] };
    }

    // 2. Construct Eligibility Input
    const isSafai = (profileData.purpose || '').toLowerCase() === 'sanitation' || 
                    (profileData.occupation || '').toLowerCase() === 'sanitation';
                    
    const input: EligibilityInput = {
      category: profileData.category || 'sc',
      annualIncome: profileData.annualIncome ? Number(profileData.annualIncome) : 0,
      projectCost: profileData.projectCost ? Number(profileData.projectCost) : (profileData.requestedAmount ? Number(profileData.requestedAmount) : 0),
      gender: profileData.gender || undefined,
      age: profileData.age,
      isSafaiKaramchari: isSafai,
      purpose: profileData.purpose || undefined
    };

    // 3. Fetch active schemes
    const activeSchemes = await db
      .select()
      .from(schemes)
      .where(eq(schemes.isActive, true));

    // 4. Evaluate Eligibility
    const result = evaluateEligibility(input, activeSchemes);

    if (!result.isEligible) {
      return { success: true, data: [] };
    }

    // 5. Get UserAttributes for calculating Match Score
    const userAttrs = await getUserAttributes(user.id);

    // 6. Map to what the UI expects
    const uiSchemes = [];
    
    // Add primary scheme with calculated match
    if (result.primaryScheme) {
      const dbScheme = activeSchemes.find(s => s.id === result.primaryScheme!.schemeId);
      if (dbScheme) {
        uiSchemes.push({
          ...dbScheme,
          matchPercentage: userAttrs ? computeMatchScore(dbScheme, userAttrs) : 100
        });
      }
    }

    // Add alternatives with calculated match
    for (const alt of result.alternatives) {
      if (alt.isEligible) {
        const dbScheme = activeSchemes.find(s => s.id === alt.schemeId);
        if (dbScheme) {
          uiSchemes.push({
            ...dbScheme,
            matchPercentage: userAttrs ? computeMatchScore(dbScheme, userAttrs) : 90
          });
        }
      }
    }

    // Sort by match percentage descending
    uiSchemes.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return { success: true, data: uiSchemes }
  } catch (err: unknown) {
    console.error('Error computing recommendations:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Failed to fetch recommendations' }
  }
}
