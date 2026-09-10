"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Sync i18n with cookie on mount
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    const cookieLang = match ? match[2] : null;
    if (cookieLang && (cookieLang === 'en' || cookieLang === 'hi') && i18n.language !== cookieLang) {
      i18n.changeLanguage(cookieLang);
    }
    setMounted(true);
  }, [i18n]);

  if (!mounted) {
    return (
      <button className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-eg-border-strong)] bg-transparent opacity-50" disabled>
        <span className="material-symbols-outlined text-[20px]">language</span>
      </button>
    );
  }

  const toggleLanguage = () => {
    const isEn = i18n.language && i18n.language.startsWith("en");
    const nextLang = isEn ? "hi" : "en";
    i18n.changeLanguage(nextLang);
    document.cookie = `NEXT_LOCALE=${nextLang}; path=/; max-age=31536000`;
    router.refresh();
  };

  const isCurrentEn = i18n.language && i18n.language.startsWith("en");

  return (
    <div className="flex items-center p-1 h-10 rounded-full bg-muted/50 border border-border/10">
      <button
        onClick={() => { if (!isCurrentEn) toggleLanguage() }}
        className={`flex items-center justify-center h-full px-3 rounded-full text-[13px] font-bold transition-all duration-300 ${
          isCurrentEn 
            ? "bg-background text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => { if (isCurrentEn) toggleLanguage() }}
        className={`flex items-center justify-center h-full px-3 rounded-full text-[13px] font-bold transition-all duration-300 ${
          !isCurrentEn 
            ? "bg-background text-foreground shadow-sm" 
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Switch to Hindi"
      >
        HI
      </button>
    </div>
  );
}
