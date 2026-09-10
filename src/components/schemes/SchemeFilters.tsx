'use client'

import React, { useCallback, useTransition, useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const STATE_OPTIONS = [
  { value: 'andhra_pradesh', label: 'Andhra Pradesh' },
  { value: 'arunachal_pradesh', label: 'Arunachal Pradesh' },
  { value: 'assam', label: 'Assam' },
  { value: 'bihar', label: 'Bihar' },
  { value: 'chhattisgarh', label: 'Chhattisgarh' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'goa', label: 'Goa' },
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'haryana', label: 'Haryana' },
  { value: 'himachal_pradesh', label: 'Himachal Pradesh' },
  { value: 'jharkhand', label: 'Jharkhand' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'kerala', label: 'Kerala' },
  { value: 'madhya_pradesh', label: 'Madhya Pradesh' },
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'manipur', label: 'Manipur' },
  { value: 'meghalaya', label: 'Meghalaya' },
  { value: 'mizoram', label: 'Mizoram' },
  { value: 'nagaland', label: 'Nagaland' },
  { value: 'odisha', label: 'Odisha' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'rajasthan', label: 'Rajasthan' },
  { value: 'sikkim', label: 'Sikkim' },
  { value: 'tamil_nadu', label: 'Tamil Nadu' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'tripura', label: 'Tripura' },
  { value: 'uttar_pradesh', label: 'Uttar Pradesh' },
  { value: 'uttarakhand', label: 'Uttarakhand' },
  { value: 'west_bengal', label: 'West Bengal' },
  { value: 'jammu_kashmir', label: 'Jammu & Kashmir' },
  { value: 'ladakh', label: 'Ladakh' },
  { value: 'puducherry', label: 'Puducherry' },
]

const OCCUPATION_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'farmer', label: 'Farmer' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'entrepreneur', label: 'Entrepreneur' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'salaried', label: 'Salaried Employee' },
  { value: 'self_employed', label: 'Self Employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'government', label: 'Government Employee' },
  { value: 'daily_wager', label: 'Daily Wager' },
  { value: 'artisan', label: 'Artisan / Craftsman' },
]

export function SchemeFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      params.delete('page')
      return params.toString()
    },
    [searchParams]
  )

  const handleFilterChange = useCallback((name: string, value: string) => {
    startTransition(() => {
      router.push(pathname + '?' + createQueryString(name, value))
    })
  }, [pathname, createQueryString, router])

  const handleClearFilters = () => {
    setSearchTerm('')
    startTransition(() => {
      router.push(pathname)
    })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (searchParams.get('q') || '')) {
        handleFilterChange('q', searchTerm)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm, searchParams, handleFilterChange])

  return (
    <section className="bg-card rounded-[24px] shadow-[0px_10px_30px_rgba(34,34,34,0.05)] border border-border/20 p-6 md:p-8 flex flex-col gap-6 relative">
      {/* Search */}
      <div className="relative w-full shadow-[0px_10px_30px_rgba(34,34,34,0.02)] rounded-xl bg-card">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">search</span>
        <input
          type="text"
          placeholder="Search for schemes..."
          className="w-full h-14 pl-12 pr-4 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300 bg-transparent text-foreground/90 text-[16px] placeholder-[#444748]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* State Filter */}
      <div className="flex flex-col gap-3">
        <label className="font-semibold text-[14px] text-foreground/90">State / Territory</label>
        <Select 
          value={searchParams.get('state') || 'all'}
          onValueChange={(val) => handleFilterChange('state', val === 'all' ? '' : (val || ''))}
        >
          <SelectTrigger className="w-full h-12 rounded-lg border-border bg-card text-foreground/90 text-[16px] hover:border-primary focus:ring-1 focus:ring-primary transition-all duration-300">
            <SelectValue placeholder="All States">
              {searchParams.get('state') && searchParams.get('state') !== 'all' 
                ? STATE_OPTIONS.find(s => s.value === searchParams.get('state'))?.label || searchParams.get('state')
                : 'All States'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {STATE_OPTIONS.map(state => (
              <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Occupation Filter */}
      <div className="flex flex-col gap-3">
        <label className="font-semibold text-[14px] text-foreground/90">Occupation</label>
        <Select 
          value={searchParams.get('occupation') || 'all'}
          onValueChange={(val) => handleFilterChange('occupation', val === 'all' ? '' : (val || ''))}
        >
          <SelectTrigger className="w-full h-12 rounded-lg border-border bg-card text-foreground/90 text-[16px] hover:border-primary focus:ring-1 focus:ring-primary transition-all duration-300">
            <SelectValue placeholder="All Occupations">
              {searchParams.get('occupation') && searchParams.get('occupation') !== 'all'
                ? OCCUPATION_OPTIONS.find(o => o.value === searchParams.get('occupation'))?.label || searchParams.get('occupation')
                : 'All Occupations'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Occupations</SelectItem>
            {OCCUPATION_OPTIONS.map(occ => (
              <SelectItem key={occ.value} value={occ.value}>{occ.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gender Filter */}
      <div className="flex flex-col gap-3">
        <label className="font-semibold text-[14px] text-foreground/90">Gender</label>
        <Select 
          value={searchParams.get('gender') || 'all'}
          onValueChange={(val) => handleFilterChange('gender', val === 'all' ? '' : (val || ''))}
        >
          <SelectTrigger className="w-full h-12 rounded-lg border-border bg-card text-foreground/90 text-[16px] hover:border-primary focus:ring-1 focus:ring-primary transition-all duration-300">
            <SelectValue placeholder="All Genders">
              {searchParams.get('gender') && searchParams.get('gender') !== 'all'
                ? { male: 'Male', female: 'Female', other: 'Other' }[searchParams.get('gender') as string] || searchParams.get('gender')
                : 'All Genders'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters / Clear */}
      <div className="flex flex-wrap gap-2 items-center pt-2">
        {searchParams.toString() && (
          <button 
            onClick={handleClearFilters}
            className="font-semibold text-[14px] text-foreground hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Loading Overlay */}
      <div 
        className={`absolute inset-0 bg-card/60 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center rounded-[24px] z-10 ${isPending ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="w-8 h-8 border-3 border-primary/20 border-t-[#0b0c0c] rounded-full animate-spin" />
      </div>
    </section>
  )
}
