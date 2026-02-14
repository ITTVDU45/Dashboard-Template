import {
  Globe,
  Dribbble,
  Upload,
  Layout,
  CreditCard,
  MessageSquare,
  Star,
  Grid3X3,
  Navigation,
  Image,
  Layers,
  Building2,
  ShoppingCart,
  Scale,
  Users,
  Landmark,
  Briefcase,
  Heart,
  Cpu,
  Bookmark,
  Archive,
  FileCheck,
} from "lucide-react"
import type { SortOption } from "./types"

// ── Source Types ──────────────────────────────────────────────────────────────

export const SOURCE_LABELS: Record<string, string> = {
  web: "Web",
  dribbble: "Dribbble",
  local: "Lokal",
}

export const SOURCE_ICONS: Record<string, typeof Globe> = {
  web: Globe,
  dribbble: Dribbble,
  local: Upload,
}

export const SOURCE_COLORS: Record<string, string> = {
  web: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  dribbble: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  local: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
}

// ── Categories ───────────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
  hero: "Hero",
  header: "Header",
  pricing: "Pricing",
  testimonials: "Testimonials",
  features: "Features",
  faq: "FAQ",
  cta: "Call to Action",
  footer: "Footer",
  about: "Über uns",
  contact: "Kontakt",
  blog: "Blog",
  portfolio: "Portfolio",
  dashboard: "Dashboard",
}

export const CATEGORY_ICONS: Record<string, typeof Layout> = {
  hero: Layout,
  header: Navigation,
  pricing: CreditCard,
  testimonials: MessageSquare,
  features: Grid3X3,
  faq: MessageSquare,
  cta: Star,
  footer: Layers,
  about: Users,
  contact: MessageSquare,
  blog: FileCheck,
  portfolio: Image,
  dashboard: Grid3X3,
}

// ── Industries ───────────────────────────────────────────────────────────────

export const INDUSTRY_LABELS: Record<string, string> = {
  saas: "SaaS",
  ecommerce: "E-Commerce",
  legal: "Recht & Kanzlei",
  recruiting: "Recruiting",
  fintech: "FinTech",
  health: "Gesundheit",
  education: "Bildung",
  agency: "Agentur",
  realestate: "Immobilien",
}

export const INDUSTRY_ICONS: Record<string, typeof Building2> = {
  saas: Cpu,
  ecommerce: ShoppingCart,
  legal: Scale,
  recruiting: Users,
  fintech: Landmark,
  health: Heart,
  education: Briefcase,
  agency: Building2,
  realestate: Building2,
}

// ── Status ───────────────────────────────────────────────────────────────────

export const STATUS_LABELS: Record<string, string> = {
  saved: "Gespeichert",
  archived: "Archiviert",
  candidate: "Template-Kandidat",
}

export const STATUS_ICONS: Record<string, typeof Bookmark> = {
  saved: Bookmark,
  archived: Archive,
  candidate: FileCheck,
}

export const STATUS_COLORS: Record<string, string> = {
  saved: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  archived: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  candidate: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
}

// ── Sort Options ─────────────────────────────────────────────────────────────

export const SORT_OPTIONS: SortOption[] = [
  { value: "newest", label: "Neueste" },
  { value: "updated", label: "Zuletzt aktualisiert" },
  { value: "uses", label: "Meist genutzt" },
  { value: "name", label: "Name (A–Z)" },
]
