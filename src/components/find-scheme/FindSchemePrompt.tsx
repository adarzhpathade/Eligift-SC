"use client";

import React, { useState } from 'react';


interface FindSchemePromptProps {
  isLoading: boolean;
  onSearch: (prompt: string) => void;
}

export const FindSchemePrompt = ({ isLoading, onSearch }: FindSchemePromptProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSearch(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <>
      <div className="mt-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-display-lg-mobile md:text-[40px] text-primary mb-4 tracking-tight leading-tight font-bold font-display-lg-mobile md:font-display-lg">Describe Yourself</h1>
        <p className="font-body-md text-body-md text-muted-foreground">Tell us your situation and our AI will match you with the best government schemes.</p>
      </div>

      <div className="w-full bg-card rounded-[20px] shadow-eg-sm border border-border p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 relative overflow-hidden transition-all hover:shadow-eg-hover">
        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-transparent resize-none font-body-md text-body-md text-foreground placeholder:text-muted-foreground min-h-[160px] p-0"
            placeholder="I am a 24 year old unemployed graduate from Maharashtra..."
            rows={4}
          />
          <div className="flex justify-end items-end mt-4">
            <button 
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary/90 transition-transform hover:scale-105 shadow-sm disabled:opacity-50 disabled:hover:scale-100"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_upward</span>
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <p className="font-label-sm text-label-sm text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Popular Prompts</p>
        <button 
          onClick={() => setPrompt("I am a female entrepreneur looking for funding.")}
          className="bg-card/50 border border-border text-muted-foreground font-label-sm text-label-sm px-4 py-3 rounded-xl hover:border-primary/50 hover:bg-card hover:text-foreground transition-all text-left"
        >
          &quot;I am a female entrepreneur looking for funding.&quot;
        </button>
        <button 
          onClick={() => setPrompt("I am a farmer with less than 2 acres of land.")}
          className="bg-card/50 border border-border text-muted-foreground font-label-sm text-label-sm px-4 py-3 rounded-xl hover:border-primary/50 hover:bg-card hover:text-foreground transition-all text-left"
        >
          &quot;I am a farmer with less than 2 acres of land.&quot;
        </button>
        <button 
          onClick={() => setPrompt("I am looking for educational scholarships.")}
          className="bg-card/50 border border-border text-muted-foreground font-label-sm text-label-sm px-4 py-3 rounded-xl hover:border-primary/50 hover:bg-card hover:text-foreground transition-all text-left"
        >
          &quot;I am looking for educational scholarships.&quot;
        </button>
      </div>

    </>
  );
};
