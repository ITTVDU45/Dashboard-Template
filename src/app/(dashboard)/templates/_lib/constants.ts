import {
  Layout,
  Layers,
  Component,
  Globe,
  HardDrive,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Minus,
  type LucideIcon,
  // Category icons
  Sparkles,
  CreditCard,
  HelpCircle,
  LayoutGrid,
  Target,
  Users,
  BarChart3,
  MessageSquare,
  Image,
  Mail,
  Settings,
  Timer,
  Menu,
  FileCode2,
} from "lucide-react"
import type { TemplateIconEntry, SortOption } from "./types"

// ─── Template Type Labels & Colors ───────────────────────────────────────────

export const TYPE_LABELS: Record<string, string> = {
  project: "Projekt",
  component: "Komponente",
  section: "Section",
}

export const TYPE_COLORS: Record<string, string> = {
  project: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/20",
  component: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  section: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
}

export const TYPE_ICONS: Record<string, LucideIcon> = {
  project: Layout,
  component: Component,
  section: Layers,
}

// ─── Framework Labels & Colors ───────────────────────────────────────────────

export const FRAMEWORK_LABELS: Record<string, string> = {
  nextjs: "Next.js",
  react: "React",
  html: "HTML",
  mixed: "Mixed",
}

export const FRAMEWORK_COLORS: Record<string, string> = {
  nextjs: "bg-foreground/10 text-foreground",
  react: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  html: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  mixed: "bg-muted text-muted-foreground",
}

// ─── Source Labels & Icons ───────────────────────────────────────────────────

export const SOURCE_LABELS: Record<string, string> = {
  github: "GitHub",
  local: "Lokal",
}

export const SOURCE_ICONS: Record<string, LucideIcon> = {
  github: Globe,
  local: HardDrive,
}

// ─── Sync Status ─────────────────────────────────────────────────────────────

export const SYNC_STATUS_CONFIG: Record<string, { label: string; icon: LucideIcon; color: string }> = {
  none: { label: "Kein Sync", icon: Minus, color: "text-muted-foreground" },
  synced: { label: "Synchronisiert", icon: CheckCircle2, color: "text-accent-success" },
  out_of_sync: { label: "Nicht aktuell", icon: Clock, color: "text-accent-warning" },
  syncing: { label: "Synchronisiert...", icon: RefreshCw, color: "text-primary" },
  error: { label: "Sync-Fehler", icon: AlertCircle, color: "text-destructive" },
}

// ─── Section Categories ──────────────────────────────────────────────────────

export const SECTION_CATEGORIES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "hero", label: "Hero", icon: Sparkles },
  { value: "header", label: "Header", icon: Menu },
  { value: "about", label: "Über uns", icon: Users },
  { value: "testimonials", label: "Testimonials", icon: MessageSquare },
  { value: "pricing", label: "Pricing", icon: CreditCard },
  { value: "faq", label: "FAQ", icon: HelpCircle },
  { value: "features", label: "Features", icon: LayoutGrid },
  { value: "cta", label: "CTA", icon: Target },
  { value: "footer", label: "Footer", icon: Layers },
  { value: "forms", label: "Formulare", icon: Mail },
  { value: "stats", label: "Statistiken", icon: BarChart3 },
  { value: "timeline", label: "Timeline", icon: Timer },
  { value: "gallery", label: "Galerie", icon: Image },
  { value: "contact", label: "Kontakt", icon: Mail },
  { value: "integrations", label: "Integrationen", icon: Settings },
]

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  SECTION_CATEGORIES.map((c) => [c.value, c.label])
)

export const CATEGORY_COLORS: Record<string, string> = {
  hero: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  header: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  about: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  testimonials: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  pricing: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  faq: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  features: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  cta: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  footer: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  forms: "bg-teal-500/10 text-teal-500 border-teal-500/20",
  stats: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  timeline: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  gallery: "bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20",
  contact: "bg-lime-500/10 text-lime-500 border-lime-500/20",
  integrations: "bg-sky-500/10 text-sky-500 border-sky-500/20",
}

// ─── Icon Mapping (for Card covers) ─────────────────────────────────────────

export const TEMPLATE_ICON_MAP: TemplateIconEntry[] = [
  { keywords: ["saas", "landing"], icon: Layout, gradient: "from-violet-500 to-indigo-400" },
  { keywords: ["e-commerce", "shop", "store"], icon: CreditCard, gradient: "from-emerald-500 to-teal-400" },
  { keywords: ["portfolio", "minimal"], icon: Layers, gradient: "from-slate-500 to-gray-400" },
  { keywords: ["hero", "gradient"], icon: Sparkles, gradient: "from-amber-500 to-orange-400" },
  { keywords: ["pricing", "cards", "plan"], icon: CreditCard, gradient: "from-green-500 to-emerald-400" },
  { keywords: ["faq", "accordion"], icon: HelpCircle, gradient: "from-violet-500 to-purple-400" },
  { keywords: ["testimonial", "carousel", "review"], icon: MessageSquare, gradient: "from-pink-500 to-rose-400" },
  { keywords: ["feature", "grid"], icon: LayoutGrid, gradient: "from-blue-500 to-cyan-400" },
  { keywords: ["cta", "call"], icon: Target, gradient: "from-rose-500 to-red-400" },
  { keywords: ["footer"], icon: Layers, gradient: "from-gray-500 to-slate-400" },
  { keywords: ["header", "nav"], icon: Menu, gradient: "from-sky-500 to-blue-400" },
  { keywords: ["form", "contact"], icon: Mail, gradient: "from-teal-500 to-emerald-400" },
  { keywords: ["stat", "counter"], icon: BarChart3, gradient: "from-cyan-500 to-blue-400" },
]

export const TEMPLATE_ICON_FALLBACK = { icon: FileCode2, gradient: "from-primary to-primary/70" }

// ─── Sort Options ────────────────────────────────────────────────────────────

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "updated", label: "Zuletzt aktualisiert" },
  { value: "name", label: "Name A-Z" },
  { value: "uses", label: "Meistgenutzt" },
  { value: "created", label: "Neueste zuerst" },
]

// ─── UI Stack Labels ─────────────────────────────────────────────────────────

export const UI_STACK_LABELS: Record<string, string> = {
  tailwind: "Tailwind CSS",
  shadcn: "shadcn/ui",
  mui: "Material UI",
  custom: "Custom",
}

// ─── File Language hints ─────────────────────────────────────────────────────

export const FILE_EXTENSION_LANGUAGES: Record<string, string> = {
  tsx: "TypeScript (JSX)",
  ts: "TypeScript",
  jsx: "JavaScript (JSX)",
  js: "JavaScript",
  css: "CSS",
  html: "HTML",
  json: "JSON",
  md: "Markdown",
  yaml: "YAML",
  yml: "YAML",
  svg: "SVG",
  png: "Bild",
  jpg: "Bild",
}
