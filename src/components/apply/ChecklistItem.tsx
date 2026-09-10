import React from 'react'

export type ChecklistItemProps = {
  label: string
  status: 'verified' | 'pending' | 'missing'
}

export function ChecklistItem({ label, status }: ChecklistItemProps) {
  if (status === 'verified') {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer group">
        <div className="w-5 h-5 rounded-full border-2 border-foreground bg-foreground flex items-center justify-center">
          <span className="material-symbols-outlined text-background text-[14px]">check</span>
        </div>
        <span className="text-[14px] font-semibold text-foreground line-through text-muted-foreground">
          {label}
        </span>
      </div>
    )
  }

  if (status === 'missing') {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-destructive/50 bg-[#ffdad6]/10 hover:bg-[#ffdad6]/20 transition-colors cursor-pointer group">
        <div className="w-5 h-5 rounded-full border-2 border-destructive flex items-center justify-center">
          <span className="material-symbols-outlined text-destructive text-[14px]">priority_high</span>
        </div>
        <span className="text-[14px] font-semibold text-destructive">{label}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-background hover:bg-muted/50 transition-colors cursor-pointer group">
      <div className="w-5 h-5 rounded-full border-2 border-border/80 flex items-center justify-center group-hover:border-foreground transition-colors"></div>
      <span className="text-[14px] font-semibold text-foreground">{label}</span>
    </div>
  )
}
