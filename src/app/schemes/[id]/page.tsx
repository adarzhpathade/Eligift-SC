import React from 'react'
import { getSchemeById, getSimilarSchemes } from '@/services/schemes'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PageContainer from '@/components/layout/PageContainer'
import { getSavedSchemeIds } from '@/actions/saved-schemes'
import { SaveSchemeLargeButton } from '@/components/schemes/SaveSchemeLargeButton'
import { getAuthUser } from '@/lib/auth-cache'
import { getUserAttributes, computeMatchScore } from '@/services/recommendation'
import { getDeadlineStatus } from '@/lib/date-utils'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { SchemeInteractiveSection } from './SchemeInteractiveSection'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolvedParams = await params
  const scheme = await getSchemeById(resolvedParams.id)

  if (!scheme) {
    return { title: 'Scheme Not Found | Eligify AI' }
  }

  return {
    title: `${scheme.title} | Eligify AI`,
    description: scheme.description.slice(0, 160),
  }
}

export default async function SchemeDetailsPage({ params }: { params: Params }) {
  const resolvedParams = await params
  const schemeId = resolvedParams.id
  
  const scheme = await getSchemeById(schemeId)
  if (!scheme) {
    notFound()
  }

  // Parallelize independent data fetches
  const user = await getAuthUser()
  const [similarSchemes, { data: savedSchemeIds }, userAttrs, cookieStore] = await Promise.all([
    getSimilarSchemes(schemeId),
    getSavedSchemeIds(),
    user ? getUserAttributes(user.id) : Promise.resolve(null),
    cookies()
  ])

  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'

  if (locale === 'hi') {
    scheme.title = scheme.titleHi || scheme.title
    scheme.description = scheme.descriptionHi || scheme.description
    scheme.category = scheme.categoryHi || scheme.category
    scheme.targetGroup = scheme.targetGroupHi || scheme.targetGroup
    scheme.benefits = scheme.benefitsHi || scheme.benefits
    scheme.eligibility = scheme.eligibilityHi || scheme.eligibility
    scheme.applicationProcess = scheme.applicationProcessHi || scheme.applicationProcess
    scheme.ministry = scheme.ministryHi || scheme.ministry

    similarSchemes.forEach(s => {
      s.title = s.titleHi || s.title
      s.description = s.descriptionHi || s.description
    })
  }

  const isSaved = Array.isArray(savedSchemeIds) && savedSchemeIds.includes(scheme.id)
  const matchPercentage = userAttrs ? computeMatchScore(scheme, userAttrs) : null

  let matchText = 'Unknown Match'
  let matchColorClass = 'bg-accent text-accent-foreground'
  let matchDotColor = 'bg-muted-foreground'
  let matchTextColor = 'text-muted-foreground'

  if (matchPercentage !== null) {
    if (matchPercentage >= 80) {
      matchText = 'High Match'
      matchColorClass = 'bg-[#E8F5E9] text-[#2E7D32]'
      matchDotColor = 'bg-[#4CAF50]'
      matchTextColor = 'text-[#2E7D32]'
    } else if (matchPercentage >= 60) {
      matchText = 'Medium Match'
      matchColorClass = 'bg-[#FEF3C7] text-[#B45309]'
      matchDotColor = 'bg-[#F59E0B]'
      matchTextColor = 'text-[#B45309]'
    } else {
      matchText = 'Low Match'
      matchColorClass = 'bg-[#FFDAD6] text-[#BA1A1A]'
      matchDotColor = 'bg-[#BA1A1A]'
      matchTextColor = 'text-[#BA1A1A]'
    }
  }

  const deadline = getDeadlineStatus(scheme.endDate)
  let statusBadge = <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[12px] font-semibold uppercase tracking-wider">Open</span>
  
  if (deadline.isClosed) {
    statusBadge = <span className="px-3 py-1 rounded-full bg-[#FFDAD6] text-[#BA1A1A] text-[12px] font-semibold uppercase tracking-wider">Closed</span>
  } else if (deadline.urgency === 'high' || deadline.urgency === 'medium') {
    statusBadge = <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-[12px] font-semibold uppercase tracking-wider">Closing Soon</span>
  }
  return (
    <div className="bg-background min-h-screen pb-32">
      <PageContainer>
        <main className="py-12 space-y-12">
          {/* Hero Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {statusBadge}
                {matchPercentage !== null && (
                  <span className={`px-3 py-1 rounded-full text-[12px] font-semibold uppercase tracking-wider ${matchColorClass}`}>{matchText}</span>
                )}
                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-[12px] font-semibold uppercase tracking-wider">{scheme.schemeType}</span>
              </div>
              <h1 className="text-[32px] md:text-[48px] font-bold text-foreground leading-tight tracking-tight">
                {scheme.title}
              </h1>
              <p className="text-[20px] md:text-[24px] font-semibold text-muted-foreground">
                {scheme.ministry}
              </p>
              <p className="text-[18px] text-muted-foreground max-w-2xl pt-2">
                {scheme.description}
              </p>
            </div>
            
            <div className="lg:col-span-5">
              <div className="bg-card rounded-[20px] shadow-[0px_10px_30px_rgba(34,34,34,0.05)] border border-border/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_20px_50px_rgba(34,34,34,0.1)]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Your Eligibility</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-[56px] font-bold text-foreground">{matchPercentage !== null ? matchPercentage : '--'}</span>
                      <span className="text-[24px] font-bold text-muted-foreground">%</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-full border-[6px] border-accent flex items-center justify-center">
                    <span className="material-symbols-outlined text-foreground text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  </div>
                </div>
                <p className="text-[16px] text-muted-foreground mb-8">
                  Based on your profile, you are highly likely to qualify for this scheme. Your focus aligns with priority categories.
                </p>
                <div className="flex flex-col gap-3">
                  {deadline.isClosed ? (
                    <div className="w-full h-14 bg-[#ba1a1a] text-white rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 cursor-not-allowed opacity-90">
                      Applications Closed
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                  ) : (
                    <Link href={`/schemes/${scheme.id}/apply`} className="w-full h-14 bg-primary text-primary-foreground rounded-xl text-[14px] font-semibold hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2">
                      Apply Now
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </Link>
                  )}
                  <SaveSchemeLargeButton schemeId={scheme.id} initialIsSaved={isSaved} />
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card rounded-[20px] shadow-[0px_10px_30px_rgba(34,34,34,0.05)] p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_20px_50px_rgba(34,34,34,0.1)]">
              <span className="material-symbols-outlined text-foreground">payments</span>
              <p className="text-[12px] text-muted-foreground font-semibold uppercase">Financial Support</p>
              <p className="text-[24px] font-bold">Yes</p>
            </div>
            <div className="bg-card rounded-[20px] shadow-[0px_10px_30px_rgba(34,34,34,0.05)] p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_20px_50px_rgba(34,34,34,0.1)]">
              <span className="material-symbols-outlined text-foreground">account_balance</span>
              <p className="text-[12px] text-muted-foreground font-semibold uppercase">Category</p>
              <p className="text-[24px] font-bold">{scheme.category}</p>
            </div>
            <div className="bg-card rounded-[20px] shadow-[0px_10px_30px_rgba(34,34,34,0.05)] p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_20px_50px_rgba(34,34,34,0.1)]">
              <span className="material-symbols-outlined text-foreground">category</span>
              <p className="text-[12px] text-muted-foreground font-semibold uppercase">Target Group</p>
              <p className="text-[24px] font-bold line-clamp-1">{scheme.targetGroup}</p>
            </div>
            <div className="bg-card rounded-[20px] shadow-[0px_10px_30px_rgba(34,34,34,0.05)] p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_20px_50px_rgba(34,34,34,0.1)]">
              <span className="material-symbols-outlined text-foreground">location_on</span>
              <p className="text-[12px] text-muted-foreground font-semibold uppercase">States</p>
              <p className="text-[24px] font-bold line-clamp-1">{scheme.stateTags.length > 0 ? scheme.stateTags.join(', ') : 'All India'}</p>
            </div>
          </section>

          {/* AI Recommendation Panel */}
          <section className="bg-[var(--color-eg-ai-background)] rounded-[20px] p-8 flex flex-col md:flex-row items-center gap-8 border border-[var(--color-eg-ai-border)]">
            <div className="w-16 h-16 shrink-0 rounded-full bg-[var(--color-eg-background)] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[var(--color-eg-ai-text)] text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-[24px] font-semibold text-[var(--color-eg-ai-text)]">Eligify AI Insight</h3>
              <p className="text-[18px] font-medium text-[var(--color-eg-ai-text)]/90">
                Our AI notes your profile aligns perfectly with the primary demographics of this scheme. This combination strongly increases your approval probability.
              </p>
            </div>
          </section>

          {/* EMI Calculator & Partner Locator (Interactive Section) */}
          <SchemeInteractiveSection 
            schemeId={scheme.id}
            policy={{
              govtFundingPct: Number(scheme.govtFundingPct) || 90,
              promoterMarginPct: Number(scheme.promoterMarginPct) || 10,
              interestRateMale: scheme.interestRateMale ? Number(scheme.interestRateMale) : null,
              interestRateFemale: scheme.interestRateFemale ? Number(scheme.interestRateFemale) : null,
              minMoratorium: scheme.minMoratorium || 6,
              maxMoratorium: scheme.maxMoratorium || 6,
              maxTenureMonths: scheme.maxTenureMonths || 42,
            }}
            initialProjectCost={userAttrs?.projectCost ? Number(userAttrs.projectCost) : 50000}
            gender={userAttrs?.gender || null}
          />

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Overview, Checklist, Documents */}
            <div className="lg:col-span-8 space-y-12">
              
              <section className="space-y-4">
                <h2 className="text-[32px] font-semibold text-foreground">Scheme Overview</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                  <p className="text-[18px]">{scheme.description}</p>
                  <p className="text-[18px]"><strong>Benefits:</strong> {scheme.benefits}</p>
                  <p className="text-[18px]"><strong>Eligibility details:</strong> {scheme.eligibility}</p>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex justify-between items-end">
                  <h2 className="text-[32px] font-semibold text-foreground">Eligibility Checklist</h2>
                  <span className="text-[14px] font-semibold text-foreground">100% Completed</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: '100%' }}></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {['Age requirement', 'Income Limit', 'Citizenship Status', 'Educational Qualification'].map((item, index) => (
                    <div key={index} className="bg-card rounded-[20px] shadow-[0px_10px_30px_rgba(34,34,34,0.05)] p-5 flex items-center gap-4 border border-border/5">
                      <span className="material-symbols-outlined text-green-600 bg-green-50 p-2 rounded-full">check_circle</span>
                      <div>
                        <p className="text-[14px] font-semibold text-foreground">{item}</p>
                        <p className="text-[12px] text-muted-foreground">Verified from your profile</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-[32px] font-semibold text-foreground">Required Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {scheme.requiredDocuments.length > 0 ? scheme.requiredDocuments.map((doc, i) => (
                     <div key={i} className="bg-card rounded-[20px] shadow-[0px_10px_30px_rgba(34,34,34,0.05)] p-4 border border-border/10 relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-4">
                        <span className="material-symbols-outlined text-muted-foreground">description</span>
                      </div>
                      <p className="text-[14px] font-semibold text-foreground">{doc}</p>
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-green-600/20 group-hover:bg-green-600 transition-colors"></div>
                    </div>
                  )) : (
                    <div className="bg-card rounded-[20px] shadow-[0px_10px_30px_rgba(34,34,34,0.05)] p-4 border border-border/10 col-span-3">
                      <p className="text-[14px] text-muted-foreground">No specific documents listed.</p>
                    </div>
                  )}
                </div>
              </section>

            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-4 space-y-12">

              <section className="bg-card rounded-[20px] shadow-[0px_10px_30px_rgba(34,34,34,0.05)] p-6 border border-border/5">
                <h3 className="text-[24px] font-semibold text-foreground mb-6">Application Process</h3>
                <div className="relative space-y-8 pl-8 mb-8">
                  <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#c4c7c7]/30"></div>
                  
                  <div className="relative">
                    <div className="absolute -left-[27px] w-[14px] h-[14px] rounded-full bg-primary border-4 border-white ring-1 ring-primary"></div>
                    <p className="text-[14px] font-semibold text-foreground">Step 1: Check Eligibility</p>
                    <p className="text-[12px] text-muted-foreground">Verify your profile details against scheme rules.</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[27px] w-[14px] h-[14px] rounded-full bg-muted-foreground border-4 border-white ring-1 ring-muted-foreground"></div>
                    <p className="text-[14px] font-semibold text-foreground">Step 2: Submit Application</p>
                    <p className="text-[12px] text-muted-foreground">{scheme.applicationProcess || "Follow official instructions."}</p>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[27px] w-[14px] h-[14px] rounded-full bg-muted-foreground border-4 border-white ring-1 ring-muted-foreground"></div>
                    <p className="text-[14px] font-semibold text-foreground">Step 3: Approval</p>
                    <p className="text-[12px] text-muted-foreground">Wait for authority verification and disbursement.</p>
                  </div>
                </div>
                
                {scheme.officialUrl && (
                  <div className="pt-6 border-t border-border/10">
                    <a href={scheme.officialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 h-12 w-full bg-secondary text-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-all active:scale-95">
                      Visit Official Portal
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </a>
                  </div>
                )}
              </section>

            </div>
          </div>

          {/* Similar Schemes */}
          {similarSchemes.length > 0 && (
            <section className="space-y-6 pt-12">
              <h2 className="text-[32px] font-semibold text-foreground">Similar Schemes for You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
                {similarSchemes.map((s) => (
                  <div key={s.id} className="bg-card rounded-[20px] shadow-[0px_10px_30px_rgba(34,34,34,0.05)] p-6 min-w-[300px] border border-border/5">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2 py-1 bg-accent/50 text-accent-foreground text-[10px] font-bold rounded uppercase">Recommended</span>
                      <span className="material-symbols-outlined text-muted-foreground">bookmark</span>
                    </div>
                    <h4 className="text-[24px] font-semibold mb-2 line-clamp-1">{s.title}</h4>
                    <p className="text-[12px] text-muted-foreground mb-6 line-clamp-2">{s.description}</p>
                    <Link href={`/schemes/${s.id}`} className="text-foreground font-semibold text-[14px] flex items-center gap-1 hover:gap-2 transition-all">
                      View Details <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </PageContainer>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-card/90 backdrop-blur-xl shadow-[0px_-10px_30px_rgba(34,34,34,0.05)] z-50 border-t border-border/10 px-8 py-4 hidden md:block">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-foreground max-w-sm truncate">{scheme.title}</span>
              <span className="text-[12px] text-muted-foreground">{scheme.ministry}</span>
            </div>
            <div className="h-8 w-[1px] bg-[#c4c7c7]/30"></div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${matchDotColor}`}></span>
              <span className={`text-[14px] font-semibold ${matchTextColor}`}>{matchPercentage !== null ? `${matchPercentage}% Match` : 'Eligibility Unknown'}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="h-12 px-8 border border-primary text-foreground rounded-xl text-[14px] font-semibold hover:bg-secondary transition-all active:scale-95">
              Check Documents
            </button>
            {deadline.isClosed ? (
              <div className="h-12 px-8 bg-[#ba1a1a] text-white rounded-xl text-[14px] font-semibold flex items-center justify-center cursor-not-allowed opacity-90">
                Closed
              </div>
            ) : (
              <Link href={`/schemes/${scheme.id}/apply`} className="h-12 px-12 bg-primary text-primary-foreground rounded-xl text-[14px] font-semibold hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center">
                Apply Now
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-card shadow-[0px_-10px_30px_rgba(34,34,34,0.05)] z-50 border-t border-border/10 p-4 md:hidden">
        <div className="flex gap-3">
          <button className="flex-1 h-12 bg-secondary text-foreground rounded-xl text-[14px] font-semibold active:scale-95">
            Check Docs
          </button>
          {deadline.isClosed ? (
            <div className="flex-1 h-12 bg-[#ba1a1a] text-white rounded-xl text-[14px] font-semibold flex items-center justify-center cursor-not-allowed opacity-90">
              Closed
            </div>
          ) : (
            <Link href={`/schemes/${scheme.id}/apply`} className="flex-1 h-12 bg-primary text-primary-foreground rounded-xl text-[14px] font-semibold active:scale-95 flex items-center justify-center">
              Apply Now
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
