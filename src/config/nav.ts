import {
  LayoutDashboard,
  Key,
  BarChart3,
  FileText,
  HardDrive,
  BookOpen,
  CreditCard,
  Store,
  Puzzle,
  Workflow,
  HeadphonesIcon,
  Settings,
  Lightbulb,
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
    titleKey: "nav.sections.development",
    items: [
      {
        titleKey: "nav.items.apiKeys",
        href: "/api-keys",
        icon: Key,
      },
      {
        titleKey: "nav.items.usage",
        href: "/usage",
        icon: BarChart3,
      },
      {
        titleKey: "nav.items.logs",
        href: "/logs",
        icon: FileText,
      },
      {
        titleKey: "nav.items.storage",
        href: "/storage",
        icon: HardDrive,
      },
    ],
  },
  {
    titleKey: "nav.sections.resources",
    items: [
      {
        titleKey: "nav.items.docs",
        href: "/docs",
        icon: BookOpen,
      },
      {
        titleKey: "nav.items.billing",
        href: "/billing",
        icon: CreditCard,
      },
    ],
  },
  {
    titleKey: "nav.sections.account",
    items: [
      {
        titleKey: "nav.items.marketplace",
        href: "/marketplace",
        icon: Store,
      },
      {
        titleKey: "nav.items.integrations",
        href: "/integrations",
        icon: Puzzle,
      },
      {
        titleKey: "nav.items.workflows",
        href: "/workflows",
        icon: Workflow,
      },
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
      {
        titleKey: "nav.items.wishlist",
        href: "/wishlist",
        icon: Lightbulb,
        badge: "Neu",
      },
    ],
  },
];
