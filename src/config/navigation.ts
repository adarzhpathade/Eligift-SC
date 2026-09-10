export type NavigationItem = {
  label: string;
  ariaLabel: string;
  link: string;
};

export const navigationMenu: NavigationItem[] = [
  {
    label: "Dashboard",
    ariaLabel: "Go to dashboard",
    link: "/dashboard",
  },
  {
    label: "Browse Schemes",
    ariaLabel: "Browse government schemes",
    link: "/schemes",
  },
  {
    label: "Find Me Scheme",
    ariaLabel: "AI scheme discovery",
    link: "/find-scheme",
  },
  {
    label: "Compare",
    ariaLabel: "Compare Schemes",
    link: "/compare",
  },
  {
    label: "Saved Schemes",
    ariaLabel: "View saved schemes",
    link: "/saved",
  },
  {
    label: "Profile",
    ariaLabel: "View your profile",
    link: "/profile",
  },
];
