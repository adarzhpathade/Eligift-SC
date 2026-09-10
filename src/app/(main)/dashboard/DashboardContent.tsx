"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { BentoGrid } from '@/components/layout/BentoGrid';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DashboardAISearch } from '@/components/dashboard/DashboardAISearch';
import { SchemeCard } from '@/components/schemes/SchemeCard';
import { SavedSchemesWidget } from "@/components/dashboard/SavedSchemesWidget";

type DashboardContentProps = {
  firstName: string;
  recommendedSchemes: any[];
  savedSchemes: any[];
};

export const DashboardContent = ({ firstName, recommendedSchemes, savedSchemes }: DashboardContentProps) => {
  const { t } = useTranslation();

  return (
    <BentoGrid>
      <DashboardHero name={firstName} schemeCount={Math.min(5, recommendedSchemes.length)} />
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:col-span-2">
        <MetricCard 
          title={t('dashboard.eligibleSchemes')} 
          value={Math.min(5, recommendedSchemes.length)} 
          icon="assignment_turned_in" 
        />
        <MetricCard 
          title={t('dashboard.savedSchemes')} 
          value={savedSchemes.length} 
          icon="bookmark" 
        />
      </div>
      
      <div className="lg:col-span-4 mt-4 mb-2">
        <DashboardAISearch />
      </div>

      <div className="lg:col-span-4 flex justify-between items-center mt-6 mb-4 md:mb-0 pb-2">
        <h2 className="text-[20px] md:text-[24px] font-semibold text-primary leading-tight mr-4">{t('dashboard.recommended')}</h2>
        <Link href="/schemes" className="text-[14px] font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap">
          {t('dashboard.viewAll')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      {recommendedSchemes.length > 0 ? (
        recommendedSchemes.slice(0, 5).map((scheme: any) => (
          <SchemeCard 
            key={scheme.id}
            id={scheme.id}
            matchPercentage={scheme.matchPercentage}
            ministry={scheme.ministry}
            title={scheme.title}
            description={scheme.description}
            opens={scheme.startDate ? new Date(scheme.startDate).toLocaleDateString() : undefined}
            closes={scheme.endDate ? new Date(scheme.endDate).toLocaleDateString() : undefined}
          />
        ))
      ) : (
        <div className="lg:col-span-4 text-center py-10 bg-white/50 backdrop-blur-[10px] rounded-[20px] border border-white/20">
          <span className="material-symbols-outlined text-4xl text-muted-foreground mb-2">inbox</span>
          <h3 className="text-xl font-semibold text-primary">{t('dashboard.noSchemes')}</h3>
          <p className="text-muted-foreground">{t('dashboard.noSchemesDesc')}</p>
        </div>
      )}

      <div className="lg:col-span-4 mt-6">
        <SavedSchemesWidget schemes={savedSchemes} />
      </div>
    </BentoGrid>
  );
};
