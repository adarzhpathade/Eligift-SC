import React from 'react';
import { redirect } from "next/navigation";
import { getAuthUser, getProfile } from "@/lib/auth-cache";
import { getRecommendedSchemes } from "@/actions/schemes";
import { getSavedSchemes } from "@/actions/saved-schemes";
import { DashboardContent } from "./DashboardContent";
import { cookies } from "next/headers";

export const metadata = {
  title: 'Dashboard | Eligify',
};

export default async function DashboardPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile();
  const fullName = profile?.fullName ?? "Citizen";
  const firstName = fullName.split(" ")[0];

  // Parallelize independent data fetches
  const [{ success, data: recommendations }, { success: savedSuccess, data: savedData }, cookieStore] = await Promise.all([
    getRecommendedSchemes(),
    getSavedSchemes(),
    cookies()
  ]);

  let recommendedSchemes = success && recommendations ? recommendations : [];
  let savedSchemes = savedSuccess && savedData ? savedData : [];

  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'
  if (locale === 'hi') {
    recommendedSchemes = recommendedSchemes.map((s: any) => ({
      ...s,
      title: s.titleHi || s.title,
      description: s.descriptionHi || s.description
    }))
    savedSchemes = savedSchemes.map((s: any) => ({
      ...s,
      scheme: {
        ...s.scheme,
        title: s.scheme.titleHi || s.scheme.title,
        description: s.scheme.descriptionHi || s.scheme.description
      }
    }))
  }

  return (
    <div className="py-12">
      <DashboardContent 
        firstName={firstName}
        recommendedSchemes={recommendedSchemes}
        savedSchemes={savedSchemes}
      />
    </div>
  );
}
