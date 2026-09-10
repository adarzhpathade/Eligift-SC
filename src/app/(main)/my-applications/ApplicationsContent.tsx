"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';
import type { ApplicationSummary } from '@/actions/applications';

type Props = {
  applications: ApplicationSummary[];
};

/* ── Status badge helper ── */
function getStatusDisplay(status: string, t: (key: string) => string) {
  switch (status) {
    case 'DOSSIER_GENERATED':
      return {
        label: t('applications.active'),
        bg: 'bg-[var(--color-eg-success-light)]',
        text: 'text-[var(--color-eg-success-dark)]',
        icon: 'check_circle',
      };
    default:
      return {
        label: status,
        bg: 'bg-[var(--color-eg-info-light)]',
        text: 'text-[var(--color-eg-info)]',
        icon: 'info',
      };
  }
}

/* ── Circular progress ring ── */
function ProgressRing({ percent, size = 64, strokeWidth = 5 }: { percent: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-eg-surface-high)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-eg-success)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

/* ── Stat Card ── */
function StatCard({ icon, label, value, accent }: { icon: string; label: string; value: string | number; accent?: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-[var(--shadow-eg-sm)] transition-all duration-300 hover:shadow-[var(--shadow-eg-hover)]">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accent || 'bg-secondary'}`}>
        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider leading-tight">{label}</p>
        <p className="text-[22px] font-bold text-foreground leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}

/* ── Application Card ── */
function ApplicationCard({ app, t }: { app: ApplicationSummary; t: (key: string, opts?: Record<string, unknown>) => string }) {
  const status = getStatusDisplay(app.status, t);
  const createdDate = new Date(app.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-card border border-border rounded-[20px] shadow-[var(--shadow-eg-sm)] overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-eg-hover)] hover:-translate-y-0.5">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-[20px] font-bold text-foreground leading-tight line-clamp-2">{app.schemeTitle}</h3>
            <div className="flex items-center gap-2 mt-1.5 text-muted-foreground">
              <span className="material-symbols-outlined text-[14px]">account_balance</span>
              <span className="text-[12px] font-medium">{app.schemeMinistry}</span>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 ${status.bg} ${status.text}`}>
            <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>{status.icon}</span>
            {status.label}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground font-mono">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">tag</span>
            {app.trackingCode}
          </div>
          <span className="text-border hidden sm:inline">•</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">calendar_today</span>
            {t('applications.appliedOn')} {createdDate}
          </div>
        </div>
      </div>

      {/* Financial Grid */}
      <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-border bg-secondary/30">
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t('applications.projectCost')}</p>
          <p className="text-[16px] font-bold text-foreground">{formatCurrency(app.projectCost)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t('applications.monthlyEmi')}</p>
          <p className="text-[16px] font-bold text-primary">{formatCurrency(app.calculatedEmi)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t('applications.moratorium')}</p>
          <p className="text-[16px] font-bold text-foreground">{app.selectedMoratorium} {t('applications.months')}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t('applications.interestRate')}</p>
          <p className="text-[16px] font-bold text-foreground">{app.interestRate !== null ? `${app.interestRate}%` : '—'}</p>
        </div>
      </div>

      {/* Repayment Progress */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[16px] text-muted-foreground">trending_up</span>
          <h4 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">{t('applications.repaymentProgress')}</h4>
          <span className="text-[10px] text-muted-foreground/60 font-medium ml-auto">({t('applications.estimated')})</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Progress ring */}
          <div className="relative shrink-0">
            <ProgressRing percent={app.progressPercent} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[14px] font-bold text-foreground">{app.progressPercent}%</span>
            </div>
          </div>

          {/* Amounts */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{t('applications.totalRepayable')}</p>
              <p className="text-[14px] font-bold text-foreground">{formatCurrency(app.totalRepayable)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{t('applications.amountPaid')}</p>
              <p className="text-[14px] font-bold text-[var(--color-eg-success)]">{formatCurrency(app.estimatedPaid)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">{t('applications.remaining')}</p>
              <p className="text-[14px] font-bold text-foreground">{formatCurrency(app.estimatedRemaining)}</p>
            </div>
          </div>
        </div>

        {/* Linear bar + month label */}
        <div className="mt-3">
          <div className="w-full h-2 rounded-full bg-[var(--color-eg-surface-high)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-eg-success)] transition-all duration-700 ease-out"
              style={{ width: `${app.progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">
            {t('applications.monthsCompleted', { done: app.monthsElapsed, total: app.maxTenureMonths })}
          </p>
        </div>
      </div>

      {/* Assigned Branch */}
      <div className="px-6 py-4 border-b border-border">
        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('applications.assignedBranch')}</h4>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px] text-muted-foreground">account_balance</span>
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-foreground">{app.partnerBank}</p>
            <p className="text-[12px] text-muted-foreground">{app.partnerBranch} · {app.partnerIfsc}</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 py-4 flex flex-col sm:flex-row gap-3 w-full">
        <Link
          href={`/dossiers/${app.trackingCode}`}
          className="w-full sm:flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-200"
        >
          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
          {t('applications.viewRoutingSlip')}
        </Link>
        {app.partnerAddress && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(app.partnerBank + ' ' + app.partnerBranch + ' ' + app.partnerAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 h-11 rounded-xl bg-secondary text-foreground text-[13px] font-semibold flex items-center justify-center gap-2 border border-border hover:bg-muted transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[16px]">directions</span>
            {t('applications.navigateToBranch')}
          </a>
        )}
      </div>
    </div>
  );
}

/* ── Main Content ── */
export const ApplicationsContent = ({ applications }: Props) => {
  const { t } = useTranslation();

  const totalApps = applications.length;
  const activeLoans = applications.filter((a) => a.status === 'DOSSIER_GENERATED').length;
  const totalMonthlyEmi = applications
    .filter((a) => a.status === 'DOSSIER_GENERATED')
    .reduce((sum, a) => sum + a.calculatedEmi, 0);

  if (applications.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-[28px] md:text-[36px] font-bold text-foreground mb-2">{t('applications.title')}</h1>
        <p className="text-muted-foreground mb-10">{t('applications.subtitle')}</p>
        <div className="bg-card border border-dashed border-border rounded-[20px] p-12 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-5">
            <span className="material-symbols-outlined text-[36px] text-muted-foreground/50">folder_open</span>
          </div>
          <h2 className="text-[20px] font-bold text-foreground mb-2">{t('applications.noApplications')}</h2>
          <p className="text-muted-foreground text-[14px] max-w-md mb-6">{t('applications.noApplicationsDesc')}</p>
          <Link
            href="/schemes"
            className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            {t('applications.browseSchemes')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[28px] md:text-[36px] font-bold text-foreground mb-1">{t('applications.title')}</h1>
        <p className="text-muted-foreground text-[14px] md:text-[16px]">{t('applications.subtitle')}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon="description"
          label={t('applications.totalApplications')}
          value={totalApps}
          accent="bg-[var(--color-eg-info-light)] text-[var(--color-eg-info)]"
        />
        <StatCard
          icon="verified"
          label={t('applications.activeLoans')}
          value={activeLoans}
          accent="bg-[var(--color-eg-success-light)] text-[var(--color-eg-success)]"
        />
        <StatCard
          icon="payments"
          label={t('applications.monthlyOutgoing')}
          value={formatCurrency(totalMonthlyEmi)}
          accent="bg-[var(--color-eg-warning-light)] text-[var(--color-eg-warning)]"
        />
      </div>

      {/* Application Cards */}
      <div className="space-y-6">
        {applications.map((app) => (
          <ApplicationCard key={app.trackingCode} app={app} t={t} />
        ))}
      </div>
    </div>
  );
};
