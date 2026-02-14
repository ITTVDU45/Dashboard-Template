import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Palette,
  FileCode2,
  Workflow,
  HardDrive,
  Bot,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const navConfig: NavItem[] = [
  { title: "Übersicht", href: "/overview", icon: LayoutDashboard },
  { title: "Unternehmen", href: "/companies", icon: Building2 },
  { title: "Projekte", href: "/projects", icon: FolderKanban },
  { title: "Designs (Inspiration)", href: "/designs", icon: Palette },
  { title: "Templates", href: "/templates", icon: FileCode2 },
  { title: "Workflows / Jobs", href: "/workflows", icon: Workflow },
  { title: "Assets", href: "/assets", icon: HardDrive },
  { title: "Agenten", href: "/agents", icon: Bot },
  { title: "Einstellungen", href: "/settings", icon: Settings },
];
