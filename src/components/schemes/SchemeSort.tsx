'use client'

import React, { useCallback, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SchemeSort() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const currentSort = searchParams.get('sort') || 'relevance'

  const handleSortChange = useCallback((value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'relevance') {
      params.set('sort', value)
    } else {
      params.delete('sort')
    }
    params.delete('page')
    
    startTransition(() => {
      router.push(pathname + '?' + params.toString())
    })
  }, [pathname, searchParams, router])

  return (
    <div className="flex items-center gap-3 relative">
      <label className="text-[14px] text-muted-foreground whitespace-nowrap">Sort by:</label>
      <Select 
        value={currentSort}
        onValueChange={handleSortChange}
        disabled={isPending}
      >
        <SelectTrigger className="h-10 rounded-lg border-border bg-card text-foreground/90 text-[14px] hover:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 min-w-[140px]">
          <SelectValue placeholder="Sort by">
            {
              currentSort === 'relevance' ? 'Relevance' :
              currentSort === 'match' ? 'Match Score' :
              currentSort === 'newest' ? 'Newest Added' :
              currentSort === 'closing-soon' ? 'Closing Soon' :
              currentSort === 'alphabetical' ? 'Alphabetical (A-Z)' :
              'Relevance'
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="match">Match Score</SelectItem>
          <SelectItem value="newest">Newest Added</SelectItem>
          <SelectItem value="closing-soon">Closing Soon</SelectItem>
          <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
