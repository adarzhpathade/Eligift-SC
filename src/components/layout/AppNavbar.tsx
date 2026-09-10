"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationMenu } from "@/config/navigation";
import StaggeredMenu from "@/components/navigation/StaggeredMenu";
import GradualBlur from "@/components/GradualBlur";
import { signOutAction } from "@/actions/auth";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { useTranslation } from "react-i18next";

export default function AppNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();

  const translatedNav = navigationMenu.map(item => {
    let translatedLabel = item.label;
    if (item.label === 'Dashboard') translatedLabel = t('nav.dashboard');
    else if (item.label === 'Browse Schemes') translatedLabel = t('nav.browseSchemes');
    else if (item.label === 'My Applications') translatedLabel = t('nav.myApplications');
    else if (item.label === 'Compare') translatedLabel = t('nav.compare');
    else if (item.label === 'Saved Schemes') translatedLabel = t('nav.savedSchemes');
    else if (item.label === 'Profile') translatedLabel = t('nav.profileLabel');
    return { ...item, label: translatedLabel };
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname === "/onboarding") {
    return null;
  }

  return (
    <>
      {/* Gradual Blur for scrolled content behind the navbar */}
      <GradualBlur
        target="page"
        position="top"
        height="120px"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential
        opacity={isScrolled ? 1 : 0}
        animated
        zIndex={10} // Will become 110 (10 + 100 in component), staying below the z-[200] navbar
      />

      <div className="w-full flex justify-center sticky top-4 z-[200]">
        <nav
        id="app-navbar"
        className="w-[95%] lg:w-[85%] h-[80px] flex items-center relative transition-all duration-300"
      >
        <div className="w-full px-5 lg:px-8 flex items-center justify-between relative z-10">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/eligify-text-icon.png"
              alt="Eligify AI"
              width={300}
              height={90}
              className="w-[140px] md:w-[180px] h-auto object-contain dark:invert"
              priority
            />
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative flex items-center gap-1 md:gap-2">
              <ThemeToggle />
              <LanguageToggle />
              <StaggeredMenu
                position="right"
                items={translatedNav}
                displaySocials={false}
                displayItemNumbering={false}
                menuButtonColor="var(--accent-foreground)"
                openMenuButtonColor="var(--accent-foreground)"
                changeMenuColorOnOpen={false}
                colors={["var(--accent)", "var(--background)"]}
                accentColor="var(--accent-foreground)"
                isFixed={false}
              >
                <form action={signOutAction} className="block md:hidden mt-auto">
                  <button
                    id="logout-button-mobile"
                    type="submit"
                    className="px-8 py-4 rounded-full text-lg font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors duration-300 w-full"
                  >
                    {t('nav.logout')}
                  </button>
                </form>
              </StaggeredMenu>
            </div>
            <form action={signOutAction} className="hidden md:block">
              <button
                id="logout-button"
                type="submit"
                className="px-5 py-2.5 rounded-full text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors duration-300"
              >
                {t('nav.logout')}
              </button>
            </form>
          </div>
        </div>
      </nav>
    </div>
    </>
  );
}
