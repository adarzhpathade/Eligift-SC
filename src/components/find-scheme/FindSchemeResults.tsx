import React from 'react';
import { AIRecommendationCard } from './AIRecommendationCard';
import { useTranslation } from 'react-i18next';

export interface AIResult {
  scheme_id: string;
  relevance_score: number;
  explanation: string;
  schemeDetails: {
    id?: string;
    title: string;
    description: string;
    category: string;
    targetGroup?: string;
    eligibility?: string;
    occupationTags?: string[];
    stateTags?: string[];
    ageMin?: number | null;
    ageMax?: number | null;
    incomeLimit?: string | null;
  };
}

interface FindSchemeResultsProps {
  results: AIResult[] | null;
  savedSchemeIds: string[];
  isSearching: boolean;
  hasSearched: boolean;
}

export const FindSchemeResults = ({ results, savedSchemeIds, isSearching, hasSearched }: FindSchemeResultsProps) => {
  const { t } = useTranslation();

  if (!hasSearched && !isSearching) {
    return null; // Initial state shows nothing on the right panel in the exact design
  }

  return (
    <>
      {/* AI Thinking State */}
      {isSearching && (
        <div className="w-full flex flex-col items-center justify-center py-16 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <div className="w-20 h-20 mb-6 text-primary">
            <svg fill="none" height="80" viewBox="0 0 24 24" width="80" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor">
                <animate attributeName="opacity" dur="1.5s" repeatCount="indefinite" values="1;0.3;1"></animate>
              </path>
            </svg>
          </div>
          <p className="font-headline-md text-headline-md text-primary mb-4 font-bold">{t('results.analyzing')}</p>
          <div className="w-80 h-1.5 rounded-full bg-surface-variant overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite_linear] rounded-full"></div>
          </div>
        </div>
      )}

      {/* Results Content */}
      {!isSearching && hasSearched && results && (
        <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 card-list-blur-others">


          {results.length === 0 ? (
              <div className="bg-card rounded-[24px] shadow-sm border border-border p-8 text-center">
                <span className="material-symbols-outlined text-[48px] text-muted-foreground mb-4">search_off</span>
                <h3 className="text-[20px] font-bold text-foreground">{t('results.noMatches')}</h3>
                <p className="text-muted-foreground mt-2">{t('results.tryDifferent')}</p>
              </div>
          ) : (
             <div className="flex flex-col gap-6">
               {results.map((result, index) => (
                 <AIRecommendationCard
                   key={result.scheme_id}
                   schemeId={result.scheme_id}
                   relevanceScore={result.relevance_score}
                   explanation={result.explanation}
                   schemeDetails={result.schemeDetails}
                   isSaved={savedSchemeIds.includes(result.scheme_id)}
                   isTopMatch={index === 0}
                 />
               ))}
             </div>
          )}
        </div>
      )}
    </>
  );
};
