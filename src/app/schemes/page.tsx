import React from 'react'
import { getFilteredSchemes } from '@/services/schemes'
import { SchemeList } from '@/components/schemes/SchemeList'
import { SchemeFilters } from '@/components/schemes/SchemeFilters'
import { SchemeSort } from '@/components/schemes/SchemeSort'
import { Pagination } from '@/components/schemes/Pagination'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getAuthUser } from '@/lib/auth-cache'
import { getUserAttributes } from '@/services/recommendation'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export const metadata = {
  title: 'Browse Schemes | Eligify AI',
  description: 'Search and filter government schemes.',
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function SchemesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const resolvedParams = await searchParams
  const pageParam = resolvedParams.page
  const page = typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1
  
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined
  const state = typeof resolvedParams.state === 'string' ? resolvedParams.state : undefined
  const occupation = typeof resolvedParams.occupation === 'string' ? resolvedParams.occupation : undefined
  const gender = typeof resolvedParams.gender === 'string' ? resolvedParams.gender : undefined
  
  const ageParam = resolvedParams.age
  const age = typeof ageParam === 'string' ? parseInt(ageParam, 10) : undefined
  
  const incomeParam = resolvedParams.income
  const income = typeof incomeParam === 'string' ? parseInt(incomeParam, 10) : undefined
  
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : undefined
  const user = await getAuthUser()
  const userAttrs = user ? await getUserAttributes(user.id) : null
  
  const { data: schemesData, totalPages, currentPage, totalCount } = await getFilteredSchemes({
    page: isNaN(page) ? 1 : page,
    q,
    state,
    occupation,
    gender,
    age: age !== undefined && !isNaN(age) ? age : undefined,
    income: income !== undefined && !isNaN(income) ? income : undefined,
    sort,
    userAttrs // Pass user attributes directly to enable SQL scoring
  })

  // Schemes will already contain matchPercentage if userAttrs was provided
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let schemes = schemesData as any[]

  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'
  if (locale === 'hi') {
    schemes = schemes.map(s => ({
      ...s,
      title: s.titleHi || s.title,
      description: s.descriptionHi || s.description
    }))
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[64px] pt-12 md:pt-16">
        {/* Header Section */}
        <section className="mb-12">
          <h1 className="text-[32px] md:text-[48px] font-bold leading-tight text-foreground tracking-tight max-w-2xl">
            Explore Government Schemes
          </h1>
          <p className="text-[18px] text-muted-foreground mt-4 max-w-2xl">
            Discover and apply for financial assistance and support programs tailored to your profile.
          </p>
        </section>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative items-start">
          {/* Mobile Filter Button (Bottom Sheet) */}
          <div className="w-full block lg:hidden z-30 mb-2">
            <Sheet>
              <SheetTrigger className="w-full bg-primary text-primary-foreground h-14 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-[0px_10px_30px_rgba(34,34,34,0.1)]">
                <span className="material-symbols-outlined">filter_list</span>
                Filters
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-[24px] px-2 py-6 overflow-y-auto">
                <SheetHeader className="px-4 pb-2">
                  <SheetTitle className="text-left text-xl">Filter Schemes</SheetTitle>
                </SheetHeader>
                <Suspense fallback={<div className="h-[400px] bg-white animate-pulse rounded-[24px]"></div>}>
                  <SchemeFilters />
                </Suspense>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filter Pane */}
          <aside className="hidden lg:block w-[360px] shrink-0 sticky top-24 z-30">
            <Suspense fallback={<div className="h-[400px] bg-white animate-pulse rounded-[24px]"></div>}>
              <SchemeFilters />
            </Suspense>
          </aside>

          {/* Right Pane (Results) */}
          <section className="flex-grow min-w-0">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <h2 className="text-[24px] font-semibold text-foreground">All Schemes ({totalCount})</h2>
              <Suspense fallback={<div className="w-[200px] h-10 bg-card animate-pulse rounded-lg"></div>}>
                <SchemeSort />
              </Suspense>
            </div>

            {/* Scheme Grid */}
            <SchemeList schemes={schemes} />

            {/* Pagination */}
            <Suspense fallback={<div></div>}>
              <Pagination totalPages={totalPages} currentPage={currentPage} />
            </Suspense>
          </section>
        </div>
      </div>
    </div>
  )
}
