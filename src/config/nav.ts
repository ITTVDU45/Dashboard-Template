import {
  LayoutDashboard,
  HeadphonesIcon,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  titleKey: string; // i18n key
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavSection {
  titleKey: string; // i18n key
  items: NavItem[];
}

export const navConfig: NavSection[] = [
  {
    titleKey: "nav.sections.overview",
    items: [
      {
        titleKey: "nav.items.dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    titleKey: "nav.sections.account",
    items: [
      {
        titleKey: "nav.items.support",
        href: "/support",
        icon: HeadphonesIcon,
      },
      {
        titleKey: "nav.items.settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];
