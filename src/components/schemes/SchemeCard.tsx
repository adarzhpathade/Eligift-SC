"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import TiltedCard from '../ui/TiltedCard';
import { getDeadlineStatus } from '@/lib/date-utils';

type SchemeCardProps = {
  id: string;
  matchPercentage?: number;
  ministry: string;
  title: string;
  description: string;
  opens?: string;
  closes?: string;
};

/**
 * Returns the design-token-based color classes for the match percentage badge.
 * Uses Eligify match score tokens from globals.css.
 */
function getMatchTierStyles(percentage: number): { bg: string; text: string; icon: string } {
  if (percentage >= 80) {
    return {
      bg: 'bg-[#E8F5E9]',
      text: 'text-[#2E7D32]',
      icon: 'check_circle',
    };
  }
  if (percentage >= 60) {
    return {
      bg: 'bg-[#FEF3C7]',
      text: 'text-[#B45309]',
      icon: 'info',
    };
  }
  return {
    bg: 'bg-[#FFDAD6]',
    text: 'text-[#BA1A1A]',
    icon: 'warning',
  };
}

export const SchemeCard = ({ id, matchPercentage, ministry, title, description, closes }: SchemeCardProps) => {
  const { t } = useTranslation();
  const tier = matchPercentage !== undefined ? getMatchTierStyles(matchPercentage) : null;
  const deadline = getDeadlineStatus(closes);

  return (
    <div className="w-full h-full">
      <TiltedCard
        containerHeight="100%"
        containerWidth="100%"
        imageHeight="100%"
        imageWidth="100%"
        rotateAmplitude={8}
        scaleOnHover={1.03}
        showMobileWarning={false}
        showTooltip={false}
        displayOverlayContent={true}
        overlayContent={
          <div className="card-item bg-card border border-border rounded-[20px] p-6 flex flex-col gap-3 shadow-[0px_10px_30px_rgba(34,34,34,0.05)] transition-all duration-300 group relative w-full h-full">
            <div className="flex justify-between items-start mb-2">
              {matchPercentage !== undefined && tier ? (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold leading-[1.4] gap-1 transition-all duration-300 ${tier.bg} ${tier.text}`}
                >
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {tier.icon}
                  </span>
                  {t('schemes.match', { percentage: matchPercentage })}
                </span>
              ) : (
                <div>{/* spacer */}</div>
              )}
            </div>
            
            <div>
              <h3 className="text-[24px] font-semibold leading-[1.3] text-foreground mb-2 line-clamp-2 group-hover:underline">
                <Link href={`/schemes/${id}`} className="focus:outline-none before:absolute before:inset-0">
                  {title}
                </Link>
              </h3>
              <p className="text-[16px] leading-[1.6] text-muted-foreground line-clamp-3">
                {description}
              </p>
            </div>
            
            <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-border relative z-10">
              <div className="flex items-center gap-2 text-muted-foreground text-[12px] font-medium leading-[1.4]">
                <span className="material-symbols-outlined text-[16px]">account_balance</span>
                {ministry}
              </div>
              <div className={`flex items-center gap-2 text-[12px] font-medium leading-[1.4] ${deadline.colorClass}`}>
                <span className="material-symbols-outlined text-[16px]">{deadline.icon}</span>
                {deadline.status}
              </div>
            </div>
            
            <div className="mt-4 pt-2 relative z-20">
              {deadline.isClosed ? (
                <div className="w-full h-12 rounded-lg bg-destructive/10 text-destructive text-[14px] font-semibold leading-[1.4] border border-destructive/20 flex items-center justify-center gap-2 cursor-not-allowed">
                  {t('schemes.applicationsClosed')}
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
              ) : (
                <Link 
                  href={`/schemes/${id}`}
                  className="w-full h-12 rounded-lg bg-secondary text-foreground text-[14px] font-semibold leading-[1.4] hover:bg-muted transition-all duration-300 border border-border flex items-center justify-center gap-2"
                >
                  {t('schemes.checkEligibility')}
                  <span className="material-symbols-outlined text-[18px]">fact_check</span>
                </Link>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
};
