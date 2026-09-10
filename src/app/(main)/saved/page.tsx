import React from 'react'
import { getSavedSchemes } from '@/actions/saved-schemes'
import { SchemeList } from '@/components/schemes/SchemeList'
import PageContainer from '@/components/layout/PageContainer'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = {
  title: 'Saved Schemes | Eligify AI',
}

export default async function SavedSchemesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { success, data } = await getSavedSchemes()
  
  // Format the data to match what SchemeList expects
  // SchemeList expects: id, title, ministry, description, startDate, endDate, relevanceScore
  const savedSchemes = success && data ? data.map(s => ({
    id: s.id,
    title: s.title,
    ministry: s.ministry,
    description: s.description,
    startDate: s.startDate ? new Date(s.startDate).toISOString() : null,
    endDate: s.endDate ? new Date(s.endDate).toISOString() : null,
    matchPercentage: s.matchPercentage,
  })) : []


  return (
    <div className="bg-background min-h-screen pb-32">
      <PageContainer>
        <main className="py-12 space-y-12">
          {/* Header Section */}
          <section>
            <h1 className="text-[32px] md:text-[48px] font-bold leading-tight text-foreground tracking-tight">
              Saved Schemes
            </h1>
            <p className="text-[18px] text-muted-foreground mt-4 max-w-2xl">
              Track and manage the government schemes you are interested in.
            </p>
          </section>

          {/* Scheme Grid */}
          <section>
            {savedSchemes.length > 0 ? (
              <SchemeList schemes={savedSchemes} />
            ) : (
              <div className="bg-card rounded-[20px] shadow-sm border border-border/10 p-12 text-center flex flex-col items-center justify-center max-w-2xl mx-auto">
                <span className="material-symbols-outlined text-[64px] text-muted-foreground/40 mb-6">bookmark_border</span>
                <h2 className="text-[24px] font-semibold text-foreground mb-2">No Saved Schemes Yet</h2>
                <p className="text-[16px] text-muted-foreground mb-8">
                  You haven&apos;t bookmarked any schemes. Browse the directory to find and save schemes that match your profile.
                </p>
                <Link 
                  href="/schemes" 
                  className="h-14 px-8 bg-primary text-primary-foreground rounded-xl text-[14px] font-semibold hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center"
                >
                  Browse Schemes
                </Link>
              </div>
            )}
          </section>
        </main>
      </PageContainer>
    </div>
  )
}
