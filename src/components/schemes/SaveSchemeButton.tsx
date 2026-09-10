"use client";

import React, { useState, useTransition } from "react";
import { toggleSaveScheme } from "@/actions/saved-schemes";
import { useRouter } from "next/navigation";
import { useNativeHaptics } from "@/hooks/useNativeHaptics";

interface SaveSchemeButtonProps {
  schemeId: string;
  initialIsSaved: boolean;
}

export function SaveSchemeButton({ schemeId, initialIsSaved }: SaveSchemeButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { triggerSuccess } = useNativeHaptics();

  const handleToggle = () => {
    // Optimistic update
    const previousState = isSaved;
    setIsSaved(!isSaved);
    if (!isSaved) triggerSuccess();

    startTransition(async () => {
      const result = await toggleSaveScheme(schemeId);
      
      if (!result.success) {
        // Revert on error
        setIsSaved(previousState);
        
        if (result.error === "Unauthorized") {
          // If unauthorized, redirect to login or show toast
          router.push("/login");
        }
      }
    });
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`${isSaved ? 'text-primary' : 'text-muted-foreground hover:text-foreground'} transition-colors disabled:opacity-50`} 
      title={isSaved ? "Unsave Scheme" : "Save Scheme"}
    >
      <span className="material-symbols-outlined" style={isSaved ? { fontVariationSettings: "'FILL' 1" } : {}}>
        {isSaved ? "bookmark" : "bookmark_border"}
      </span>
    </button>
  );
}
