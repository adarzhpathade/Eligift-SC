'use client'

import React, { useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function Pagination({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageUrl = useCallback(
    (pageNumber: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', pageNumber.toString())
      return pathname + '?' + params.toString()
    },
    [searchParams, pathname]
  )

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={() => router.push(createPageUrl(currentPage - 1))}
        disabled={currentPage <= 1}
        className="w-12 h-12 flex items-center justify-center rounded-[12px] border border-border text-foreground disabled:opacity-50 disabled:pointer-events-none hover:bg-secondary transition-colors bg-white shadow-[0px_5px_15px_rgba(34,34,34,0.02)]"
      >
        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
      </button>

      <div className="flex items-center gap-1 px-4">
        <span className="text-[14px] font-semibold text-foreground">Page {currentPage} of {totalPages}</span>
      </div>

      <button
        onClick={() => router.push(createPageUrl(currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="w-12 h-12 flex items-center justify-center rounded-[12px] border border-border text-foreground disabled:opacity-50 disabled:pointer-events-none hover:bg-secondary transition-colors bg-white shadow-[0px_5px_15px_rgba(34,34,34,0.02)]"
      >
        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
      </button>
    </div>
  )
}
