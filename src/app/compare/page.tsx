import React from 'react'
import CompareClient from '@/components/compare/CompareClient'
import { getAllActiveSchemes } from '@/services/schemes'
import { getAuthUser } from '@/lib/auth-cache'
import { getUserAttributes, computeMatchScore } from '@/services/recommendation'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Compare Schemes | Eligify AI',
  description: 'Compare government schemes side by side to find the best fit.',
}

export default async function ComparePage() {
  const schemes = await getAllActiveSchemes()
  
  const user = await getAuthUser()
  const userAttrs = user ? await getUserAttributes(user.id) : null

  // Map the raw DB result to match the expected Scheme type in CompareClient
  const mappedSchemes = schemes.map(s => ({
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category,
    targetGroup: s.targetGroup,
    benefits: s.benefits,
    eligibility: s.eligibility,
    applicationProcess: s.applicationProcess,
    ageMin: s.ageMin,
    ageMax: s.ageMax,
    incomeLimit: s.incomeLimit,
    matchPercentage: userAttrs ? computeMatchScore(s, userAttrs) : undefined,
  }))

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[64px] pt-12 md:pt-16">
        <section className="mb-12">
          <h1 className="text-[32px] md:text-[48px] font-bold leading-tight text-foreground tracking-tight max-w-2xl">
            Compare Schemes
          </h1>
          <p className="text-[18px] text-muted-foreground mt-4 max-w-2xl">
            Select two schemes below to compare their benefits, eligibility, and target groups side-by-side.
          </p>
        </section>
      </div>

      <CompareClient schemes={mappedSchemes} />
    </div>
  )
}
