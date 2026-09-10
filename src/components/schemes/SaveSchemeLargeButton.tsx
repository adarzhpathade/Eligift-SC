"use client";

import React, { useState, useTransition } from "react";
import { toggleSaveScheme } from "@/actions/saved-schemes";
import { useRouter } from "next/navigation";
import { useNativeHaptics } from "@/hooks/useNativeHaptics";

interface SaveSchemeLargeButtonProps {
  schemeId: string;
  initialIsSaved: boolean;
}

export function SaveSchemeLargeButton({ schemeId, initialIsSaved }: SaveSchemeLargeButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { triggerSuccess } = useNativeHaptics();

  const handleToggle = () => {
    const previousState = isSaved;
    setIsSaved(!isSaved);
    if (!isSaved) triggerSuccess();

    startTransition(async () => {
      const result = await toggleSaveScheme(schemeId);
      
      if (!result.success) {
        setIsSaved(previousState);
        
        if (result.error === "Unauthorized") {
          router.push("/login");
        }
      }
    });
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`w-full h-14 border rounded-xl text-[14px] font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 ${
        isSaved 
          ? 'bg-accent border-accent text-accent-foreground hover:bg-accent/90' 
          : 'border-primary text-primary hover:bg-secondary/80'
      } disabled:opacity-50`}
    >
      <span className="material-symbols-outlined" style={isSaved ? { fontVariationSettings: "'FILL' 1" } : {}}>
        {isSaved ? "bookmark" : "bookmark_border"}
      </span>
      {isSaved ? "Saved to Dashboard" : "Save Scheme"}
    </button>
  );
}
