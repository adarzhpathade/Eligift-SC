import { db } from './src/db';
import { profiles, schemes } from './src/db/schema';
import { eq } from 'drizzle-orm';
import { evaluateEligibility } from './src/features/eligibility';

async function test() {
  const allProfiles = await db.select().from(profiles);
  console.log("Profiles in DB:", allProfiles.length);
  if (allProfiles.length === 0) {
    console.log("No profiles found. The user might not have completed onboarding.");
    return;
  }

  const profileData = allProfiles[0];
  console.log("Using Profile:", profileData);

  const isSafai = (profileData.purpose || '').toLowerCase() === 'sanitation' || 
                  (profileData.occupation || '').toLowerCase() === 'sanitation';
                  
  const input = {
    category: profileData.category || 'sc',
    annualIncome: profileData.annualIncome ? Number(profileData.annualIncome) : 0,
    projectCost: profileData.projectCost ? Number(profileData.projectCost) : (profileData.requestedAmount ? Number(profileData.requestedAmount) : 0),
    gender: profileData.gender || undefined,
    age: profileData.age,
    isSafaiKaramchari: isSafai
  };

  console.log("Eligibility Input:", input);

  const activeSchemes = await db.select().from(schemes).where(eq(schemes.isActive, true));
  console.log("Active Schemes:", activeSchemes.length);

  const result = evaluateEligibility(input, activeSchemes);
  console.log("Eligibility Result:", JSON.stringify(result, null, 2));

  process.exit(0);
}

test().catch(console.error);
