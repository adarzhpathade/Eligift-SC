"use client";

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FindSchemeResults, AIResult } from '../find-scheme/FindSchemeResults';
import { findMeScheme } from '@/actions/ai-finder';
import { transcribeAudio } from '@/actions/transcribe';

export const DashboardAISearch = () => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AIResult[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);

  const handleSearch = async (searchPrompt: string) => {
    if (!searchPrompt.trim() || isLoading) return;
    
    setIsLoading(true);
    setHasSearched(true);
    setPrompt(searchPrompt);
    
    try {
      const response = await findMeScheme(searchPrompt);
      if (response.success && response.data) {
        setResults(response.data);
        // Persist to session storage so it survives navigation
        try {
          sessionStorage.setItem('eligify_ai_last_prompt', searchPrompt);
          sessionStorage.setItem('eligify_ai_last_results', JSON.stringify(response.data));
        } catch (e) {
          console.error("Failed to save to session storage");
        }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  // Restore state from session storage on mount
  React.useEffect(() => {
    try {
      const savedPrompt = sessionStorage.getItem('eligify_ai_last_prompt');
      const savedResults = sessionStorage.getItem('eligify_ai_last_results');
      
      if (savedPrompt && savedResults) {
        setPrompt(savedPrompt);
        setResults(JSON.parse(savedResults));
        setHasSearched(true);
      }
    } catch (e) {
      console.error("Failed to load from session storage");
    }
  }, []);

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const toggleListen = async () => {
    // --- STOP RECORDING ---
    if (isListening) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop(); // This triggers onstop -> transcription
      }
      return;
    }

    // --- START RECORDING ---
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all mic tracks
        stream.getTracks().forEach(t => t.stop());
        setIsListening(false);
        
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        
        if (audioBlob.size < 100) return; // too small, probably no audio
        
        // Convert to base64 and send to Gemini
        setIsTranscribing(true);
        try {
          const buffer = await audioBlob.arrayBuffer();
          const base64 = btoa(
            new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          
          const result = await transcribeAudio(base64);
          if (result.success && result.text) {
            setPrompt(prev => prev ? prev + ' ' + result.text : result.text!);
          }
        } catch (err) {
          console.error("Transcription failed:", err);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err: any) {
      alert(t('aiSearch.micError'));
      setIsListening(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="w-full relative z-10 bg-card rounded-[20px] shadow-sm border border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all p-1">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-transparent resize-none font-medium text-[16px] text-foreground placeholder:text-muted-foreground/60 p-4 min-h-[80px]"
          placeholder={t('aiSearch.placeholder')}
          rows={2}
        />
        
        <div className="flex justify-between items-center p-2 border-t border-border bg-muted/30 rounded-b-[16px]">
          <div className="flex items-center gap-2 px-2">
            <button 
              type="button" 
              onClick={toggleListen}
              disabled={isTranscribing}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                isListening ? 'bg-destructive/10 text-destructive border border-destructive/20 animate-pulse' 
                : isTranscribing ? 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isListening ? 'mic' : isTranscribing ? 'hourglass_top' : 'mic_none'}
              </span>
              {isListening ? t('aiSearch.stop') : isTranscribing ? t('aiSearch.transcribing') : t('aiSearch.speak')}
            </button>
          </div>
          
          <button 
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-xl flex items-center justify-center font-semibold text-[14px] hover:bg-primary/90 transition-transform active:scale-95 shadow-sm disabled:opacity-50 disabled:active:scale-100 gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {t('aiSearch.findSchemes')}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results Area */}
      <div className={`transition-all duration-500 ease-in-out ${hasSearched || isLoading ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="py-2">
          <FindSchemeResults 
            results={results} 
            savedSchemeIds={[]} // We could pass actual saved schemes if needed
            isSearching={isLoading}
            hasSearched={hasSearched}
          />
        </div>
      </div>
    </div>
  );
};
