import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface AIRecommendationCardProps {
  schemeId: string;
  relevanceScore: number;
  explanation: string;
  schemeDetails: {
    title: string;
    description: string;
    category: string;
  };
  isSaved?: boolean;
  isTopMatch?: boolean;
}

export const AIRecommendationCard = ({ schemeId, relevanceScore, explanation, schemeDetails }: AIRecommendationCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="card-item bg-card border border-border rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 shadow-[0px_10px_30px_rgba(34,34,34,0.05)] transition-all duration-300 group relative w-full">
      
      {/* Left Column: Scheme Info & AI Explanation */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-[24px] md:text-[28px] font-semibold leading-[1.3] text-foreground mb-3 line-clamp-2 group-hover:underline">
          <Link href={`/schemes/${schemeId}`} className="focus:outline-none before:absolute before:inset-0">
            {schemeDetails.title}
          </Link>
        </h3>
        <p className="text-[16px] leading-[1.6] text-muted-foreground line-clamp-2 mb-6">
          {schemeDetails.description}
        </p>
        
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 flex items-start gap-3 relative z-10 pointer-events-none mt-auto">
          <span className="material-symbols-outlined text-[#B45309] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
          <div>
            <p className="font-label-sm text-[11px] font-medium text-on-surface-variant uppercase tracking-widest mb-1">{t('results.whyMatches')}</p>
            <p className="font-body-md text-[14px] text-on-surface leading-[1.5]">{explanation}</p>
          </div>
        </div>
      </div>

      {/* Right Column: Metadata & Action */}
      <div className="w-full md:w-[260px] shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8 relative z-10">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-max items-center px-3 py-1.5 rounded-full text-[13px] font-semibold leading-[1.4] gap-1.5 bg-[#FEF3C7] text-[#B45309]">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            {t('results.bestMatch')}
          </span>
          
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 text-muted-foreground text-[13px] font-medium leading-[1.4]">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
              {t('results.schemeLabel', { category: schemeDetails.category })}
            </div>
            <div className={`flex items-center gap-2 text-[13px] font-medium leading-[1.4] text-green-600`}>
              <span className="material-symbols-outlined text-[18px]">event_available</span>
              {t('results.ongoing')}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Link 
            href={`/schemes/${schemeId}`}
            className="w-full h-12 rounded-xl bg-secondary text-foreground text-[14px] font-semibold leading-[1.4] hover:bg-muted transition-all duration-300 border border-border flex items-center justify-center gap-2"
          >
            {t('results.checkEligibility')}
            <span className="material-symbols-outlined text-[18px]">fact_check</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

