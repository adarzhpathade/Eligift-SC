import React from 'react'
import { getSchemeById } from '@/services/schemes'
import { notFound } from 'next/navigation'
import PageContainer from '@/components/layout/PageContainer'
import { ApplyClient } from './ApplyClient'
import { getAuthUser, getProfile } from '@/lib/auth-cache'

type Params = Promise<{ id: string }>

export default async function ApplyPage({ params }: { params: Params }) {
  const resolvedParams = await params
  const schemeId = resolvedParams.id
  
  const scheme = await getSchemeById(schemeId)
  if (!scheme) {
    notFound()
  }

  const user = await getAuthUser();
  const profile = await getProfile();

  const defaultProjectCost = profile?.projectCost ? Number(profile.projectCost) : 50000;

  return (
    <div className="bg-background min-h-screen pb-32">
      <PageContainer>
        <main className="py-12 space-y-12">
          <ApplyClient 
            scheme={scheme} 
            policy={{
              minCost: scheme.minCost ? Number(scheme.minCost) : 10000,
              maxCost: scheme.maxCost ? Number(scheme.maxCost) : 5000000,
              govtFundingPct: Number(scheme.govtFundingPct) || 90,
              promoterMarginPct: Number(scheme.promoterMarginPct) || 10,
              interestRateMale: scheme.interestRateMale ? Number(scheme.interestRateMale) : null,
              interestRateFemale: scheme.interestRateFemale ? Number(scheme.interestRateFemale) : null,
              minMoratorium: scheme.minMoratorium || 6,
              maxMoratorium: scheme.maxMoratorium || 36,
              maxTenureMonths: scheme.maxTenureMonths || 84,
            }}
            initialProjectCost={defaultProjectCost}
            gender={profile?.gender || null}
          />
        </main>
      </PageContainer>
    </div>
  )
}
