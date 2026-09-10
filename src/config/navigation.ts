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
    label: "My Applications",
    ariaLabel: "Track your scheme applications",
    link: "/my-applications",
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
