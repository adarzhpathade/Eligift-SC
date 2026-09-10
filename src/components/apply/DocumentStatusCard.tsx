import React from 'react'

export type DocumentStatusCardProps = {
  type: 'verified' | 'missing' | 'skeleton' | 'invalid' | 'unrelated'
  title?: string
  subtitle?: string
  message?: string
  confidence?: number
  actionText?: string
}

export function DocumentStatusCard({
  type,
  title,
  subtitle,
  message,
  confidence,
  actionText
}: DocumentStatusCardProps) {
  if (type === 'skeleton') {
    return (
      <div className="bg-card rounded-[20px] p-5 shadow-[0px_10px_30px_rgba(34,34,34,0.05)] border border-border/20 flex flex-col sm:flex-row gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted shrink-0 animate-pulse"></div>
        <div className="flex-grow flex flex-col gap-3 justify-center">
          <div className="flex justify-between items-start">
            <div className="w-3/4 flex flex-col gap-2">
              <div className="h-4 w-48 rounded bg-muted animate-pulse"></div>
              <div className="h-3 w-32 rounded bg-muted animate-pulse"></div>
            </div>
            <div className="h-6 w-20 rounded-full bg-muted animate-pulse"></div>
          </div>
          <div className="h-16 w-full rounded-lg bg-muted animate-pulse mt-2"></div>
        </div>
      </div>
    )
  }

  if (type === 'missing' || type === 'invalid' || type === 'unrelated') {
    return (
      <div className="bg-card rounded-[20px] p-5 shadow-[0px_10px_30px_rgba(34,34,34,0.05)] border border-destructive/30 flex flex-col sm:flex-row gap-4 hover:-translate-y-1 transition-transform duration-300">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-eg-error-light)] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-destructive">
            {type === 'missing' ? 'warning' : 'error'}
          </span>
        </div>
        <div className="flex-grow flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-[16px] font-semibold text-foreground">{title}</h4>
              <span className="text-[12px] text-muted-foreground">{subtitle}</span>
            </div>
            <span className="bg-[var(--color-eg-error-light)] text-destructive px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1 capitalize">
              {type}
            </span>
          </div>
          <div className="bg-[var(--color-eg-error-light)]/50 p-3 rounded-lg border border-destructive/20 flex gap-3 mt-2">
            <span className="material-symbols-outlined text-destructive text-[20px] mt-0.5">smart_toy</span>
            <div>
              <p className="text-[14px] text-muted-foreground">{message}</p>
              {actionText && (
                <button className="mt-2 text-destructive text-[14px] font-semibold hover:underline">{actionText}</button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-[20px] p-5 shadow-[0px_10px_30px_rgba(34,34,34,0.05)] border border-border/20 flex flex-col sm:flex-row gap-4 hover:-translate-y-1 transition-transform duration-300">
      <div className="w-12 h-12 rounded-xl bg-[var(--color-eg-success-light)] flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[var(--color-eg-success-dark)]">description</span>
      </div>
      <div className="flex-grow flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-[16px] font-semibold text-foreground">{title}</h4>
            <span className="text-[12px] text-muted-foreground">{subtitle}</span>
          </div>
          <span className="bg-[var(--color-eg-success-light)] text-[var(--color-eg-success-dark)] px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span> Verified
          </span>
        </div>
        {/* AI Review Summary */}
        <div className="bg-muted p-3 rounded-lg border border-border/50 flex gap-3 mt-2">
          <span className="material-symbols-outlined text-[var(--color-eg-success-dark)] text-[20px] mt-0.5">smart_toy</span>
          <div className="w-full">
            <div className="text-[12px] font-semibold text-foreground flex items-center gap-2">
              AI Confidence: {confidence}%
              <div className="w-16 h-1 bg-[var(--color-eg-success-light)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-eg-success-dark)]" style={{ width: `${confidence}%` }}></div>
              </div>
            </div>
            <p className="text-[12px] text-muted-foreground mt-1">{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
