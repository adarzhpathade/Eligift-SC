import React from "react";
import AppNavbar from "@/components/layout/AppNavbar";
import PageContainer from "@/components/layout/PageContainer";
import OnboardingGuard from "@/components/auth/OnboardingGuard";
import { redirect } from "next/navigation";
import { getAuthUser, getProfile } from "@/lib/auth-cache";
import { PageTransition } from "@/components/ui/motion/page-transition";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile();
  const hasCompletedProfile = !!profile?.profileCompleted;

  return (
    <>
      <AppNavbar />
      <OnboardingGuard hasCompletedProfile={hasCompletedProfile}>
        <PageContainer>
          <PageTransition>{children}</PageTransition>
        </PageContainer>
      </OnboardingGuard>
    </>
  );
}
