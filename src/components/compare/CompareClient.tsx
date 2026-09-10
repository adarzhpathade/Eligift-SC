'use client'

import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Scheme = {
  id: string
  title: string
  description: string
  category: string
  targetGroup: string
  benefits: string
  eligibility: string
  applicationProcess: string
  ageMin: number | null
  ageMax: number | null
  incomeLimit: string | null
  matchPercentage?: number
}

function getMatchTierStyles(percentage: number): { bg: string; text: string; icon: string } {
  if (percentage >= 80) return { bg: 'bg-[#E8F5E9]', text: 'text-[#2E7D32]', icon: 'check_circle' }
  if (percentage >= 60) return { bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]', icon: 'info' }
  return { bg: 'bg-[#FFDAD6]', text: 'text-[#BA1A1A]', icon: 'warning' }
}

export default function CompareClient({ schemes }: { schemes: Scheme[] }) {
  const [schemeAId, setSchemeAId] = useState<string>('')
  const [schemeBId, setSchemeBId] = useState<string>('')

  const schemeA = schemes.find(s => s.id === schemeAId)
  const schemeB = schemes.find(s => s.id === schemeBId)

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1440px] mx-auto px-5 lg:px-16 py-12">
      <div className="flex flex-col md:flex-row gap-6 w-full mb-8">
        <div className="flex-1 flex flex-col gap-3">
          <label className="font-semibold text-[16px] text-foreground/90">Select Scheme A</label>
          <Select value={schemeAId} onValueChange={(val) => setSchemeAId(val || "")}>
            <SelectTrigger className="w-full h-14 rounded-xl border-border bg-card text-foreground/90 text-[16px] hover:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 shadow-sm">
              <SelectValue placeholder="-- Choose a Scheme --">
                {schemeA ? schemeA.title : null}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {schemes.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <label className="font-semibold text-[16px] text-foreground/90">Select Scheme B</label>
          <Select value={schemeBId} onValueChange={(val) => setSchemeBId(val || "")}>
            <SelectTrigger className="w-full h-14 rounded-xl border-border bg-card text-foreground/90 text-[16px] hover:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 shadow-sm">
              <SelectValue placeholder="-- Choose a Scheme --">
                {schemeB ? schemeB.title : null}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {schemes.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Scheme A Column */}
        <div className="flex flex-col gap-6 bg-card p-6 md:p-8 rounded-[24px] border border-border/40 shadow-sm min-h-[400px]">
          {schemeA ? (
            <>
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-foreground pr-4">{schemeA.title}</h2>
                {schemeA.matchPercentage !== undefined && (
                  <span
                    className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold leading-[1.4] gap-1 transition-all duration-300 ${getMatchTierStyles(schemeA.matchPercentage).bg} ${getMatchTierStyles(schemeA.matchPercentage).text}`}
                  >
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {getMatchTierStyles(schemeA.matchPercentage).icon}
                    </span>
                    {schemeA.matchPercentage}% Match
                  </span>
                )}
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit -mt-2">
                {schemeA.category}
              </span>
              <p className="text-muted-foreground text-[16px] leading-relaxed">{schemeA.description}</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="text-[14px] font-bold text-foreground uppercase tracking-wider mb-2">Target Group</h3>
                  <p className="text-foreground/80">{schemeA.targetGroup}</p>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-foreground uppercase tracking-wider mb-2">Benefits</h3>
                  <p className="text-foreground/80">{schemeA.benefits}</p>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-foreground uppercase tracking-wider mb-2">Eligibility</h3>
                  <p className="text-foreground/80">{schemeA.eligibility}</p>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-foreground uppercase tracking-wider mb-2">Age Criteria</h3>
                  <p className="text-foreground/80">
                    {schemeA.ageMin !== null || schemeA.ageMax !== null 
                      ? `${schemeA.ageMin ?? '0'} to ${schemeA.ageMax ?? 'Any'} years` 
                      : 'No specific age restrictions'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-center flex-col gap-2">
              <span className="material-symbols-outlined text-[48px] opacity-20">compare</span>
              <p>Select a scheme above to view details</p>
            </div>
          )}
        </div>

        {/* Scheme B Column */}
        <div className="flex flex-col gap-6 bg-card p-6 md:p-8 rounded-[24px] border border-border/40 shadow-sm min-h-[400px]">
          {schemeB ? (
            <>
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-foreground pr-4">{schemeB.title}</h2>
                {schemeB.matchPercentage !== undefined && (
                  <span
                    className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold leading-[1.4] gap-1 transition-all duration-300 ${getMatchTierStyles(schemeB.matchPercentage).bg} ${getMatchTierStyles(schemeB.matchPercentage).text}`}
                  >
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {getMatchTierStyles(schemeB.matchPercentage).icon}
                    </span>
                    {schemeB.matchPercentage}% Match
                  </span>
                )}
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit -mt-2">
                {schemeB.category}
              </span>
              <p className="text-muted-foreground text-[16px] leading-relaxed">{schemeB.description}</p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="text-[14px] font-bold text-foreground uppercase tracking-wider mb-2">Target Group</h3>
                  <p className="text-foreground/80">{schemeB.targetGroup}</p>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-foreground uppercase tracking-wider mb-2">Benefits</h3>
                  <p className="text-foreground/80">{schemeB.benefits}</p>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-foreground uppercase tracking-wider mb-2">Eligibility</h3>
                  <p className="text-foreground/80">{schemeB.eligibility}</p>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-foreground uppercase tracking-wider mb-2">Age Criteria</h3>
                  <p className="text-foreground/80">
                    {schemeB.ageMin !== null || schemeB.ageMax !== null 
                      ? `${schemeB.ageMin ?? '0'} to ${schemeB.ageMax ?? 'Any'} years` 
                      : 'No specific age restrictions'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-center flex-col gap-2">
              <span className="material-symbols-outlined text-[48px] opacity-20">compare</span>
              <p>Select a scheme above to compare</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
