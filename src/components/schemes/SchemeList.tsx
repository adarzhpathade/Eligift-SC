import React from 'react'
import { SchemeCard } from './SchemeCard'

type SchemeListProps = {
  schemes: Array<{
    id: string
    title: string
    description: string
    ministry: string
    startDate?: string | null
    endDate?: string | null
    matchPercentage?: number
  }>
}

export function SchemeList({ schemes }: SchemeListProps) {
  if (schemes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[24px] shadow-[0px_10px_30px_rgba(34,34,34,0.05)] border border-border/10">
        <span className="material-symbols-outlined text-[48px] text-muted-foreground mb-4">search_off</span>
        <h3 className="text-[20px] font-semibold text-foreground">No schemes found</h3>
        <p className="text-muted-foreground text-center max-w-md mt-2">
          Try adjusting your filters or search terms to find what you are looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 card-list-blur-others">
      {schemes.map((scheme) => (
        <SchemeCard
          key={scheme.id}
          id={scheme.id}
          title={scheme.title}
          description={scheme.description}
          ministry={scheme.ministry}
          matchPercentage={scheme.matchPercentage}
          opens={scheme.startDate ? scheme.startDate : undefined}
          closes={scheme.endDate ? scheme.endDate : undefined}
        />
      ))}
    </div>
  )
}
