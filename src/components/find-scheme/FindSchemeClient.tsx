"use client";

import React, { useState } from 'react';
import { FindSchemePrompt } from './FindSchemePrompt';
import { FindSchemeResults, AIResult } from './FindSchemeResults';
import { findMeScheme } from '@/actions/ai-finder';

export const FindSchemeClient = ({ initialSavedSchemeIds = [] }: { initialSavedSchemeIds?: string[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AIResult[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (prompt: string) => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const response = await findMeScheme(prompt);
      
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row flex-1 w-full h-full min-h-0">
      {/* 30% Left Panel - Prompt */}
      <aside className="w-full md:w-[30%] md:h-full flex flex-col p-6 md:p-8 md:pl-16 border-b md:border-b-0 md:border-r border-outline-variant/10 z-10 bg-surface-bright/40 backdrop-blur-sm md:overflow-y-auto">
        <FindSchemePrompt 
          isLoading={isLoading} 
          onSearch={handleSearch} 
        />
      </aside>

      {/* 70% Right Panel - Results */}
      <main className="w-full md:w-[70%] md:h-full md:overflow-y-auto px-6 md:px-16 pb-24 pt-8 flex-1">
        <FindSchemeResults 
          results={results} 
          savedSchemeIds={initialSavedSchemeIds}
          isSearching={isLoading}
          hasSearched={hasSearched}
        />
      </main>
    </div>
  );
};
