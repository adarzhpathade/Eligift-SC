"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function OnboardingGuard({
  hasCompletedProfile,
  children,
}: {
  hasCompletedProfile: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!hasCompletedProfile && pathname !== "/onboarding") {
      router.replace("/onboarding");
    } else if (hasCompletedProfile && pathname === "/onboarding") {
      router.replace("/dashboard");
    }
  }, [hasCompletedProfile, pathname, router, mounted]);

  // Prevent hydration mismatch or flashing wrong content
  if (!mounted) return null;

  if (!hasCompletedProfile && pathname !== "/onboarding") {
    return null;
  }
  if (hasCompletedProfile && pathname === "/onboarding") {
    return null;
  }

  return <>{children}</>;
}
