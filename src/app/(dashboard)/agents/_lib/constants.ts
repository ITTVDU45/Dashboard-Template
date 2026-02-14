import {
  Bot,
  Brain,
  ShieldCheck,
  Search,
  Sparkles,
  Cpu,
  BarChart3,
  Rocket,
  FileText,
  TrendingUp,
  Globe,
  Users,
  Zap,
  Target,
  LayoutGrid,
  Server,
  Activity,
} from "lucide-react"
import type { AgentIconEntry } from "./types"

// ── Icon-Mapping: Keywords im Agent-Namen → Icon + Gradient ─────────────

export const AGENT_ICON_MAP: AgentIconEntry[] = [
  { keywords: ["intelligence", "industry"], icon: Brain, gradient: "from-blue-500 to-cyan-400" },
  { keywords: ["content transformer", "multi-format"], icon: FileText, gradient: "from-violet-500 to-purple-400" },
  { keywords: ["evergreen", "recycler"], icon: TrendingUp, gradient: "from-emerald-500 to-green-400" },
  { keywords: ["personal brand"], icon: Sparkles, gradient: "from-amber-500 to-yellow-400" },
  { keywords: ["marketplace"], icon: LayoutGrid, gradient: "from-indigo-500 to-blue-400" },
  { keywords: ["model routing"], icon: Cpu, gradient: "from-pink-500 to-rose-400" },
  { keywords: ["docker", "deployment"], icon: Server, gradient: "from-sky-500 to-blue-400" },
  { keywords: ["quality", "check"], icon: ShieldCheck, gradient: "from-red-500 to-orange-400" },
  { keywords: ["funnel"], icon: Target, gradient: "from-fuchsia-500 to-pink-400" },
  { keywords: ["abo", "conversion"], icon: TrendingUp, gradient: "from-teal-500 to-emerald-400" },
  { keywords: ["upsell"], icon: Zap, gradient: "from-orange-500 to-amber-400" },
  { keywords: ["auto-crm", "neukunden"], icon: Users, gradient: "from-blue-500 to-indigo-400" },
  { keywords: ["vertrag", "rechnung"], icon: FileText, gradient: "from-slate-500 to-gray-400" },
  { keywords: ["health-score"], icon: Activity, gradient: "from-green-500 to-emerald-400" },
  { keywords: ["wettbewerb"], icon: Globe, gradient: "from-cyan-500 to-blue-400" },
  { keywords: ["revenue", "forecast"], icon: BarChart3, gradient: "from-violet-500 to-indigo-400" },
  { keywords: ["seo", "nischen"], icon: Search, gradient: "from-lime-500 to-green-400" },
  { keywords: ["produktideen"], icon: Sparkles, gradient: "from-yellow-500 to-orange-400" },
  { keywords: ["self-building"], icon: Rocket, gradient: "from-rose-500 to-red-400" },
]

export const AGENT_ICON_FALLBACK = { icon: Bot, gradient: "from-primary to-primary/70" }

// ── Typ-Labels ──────────────────────────────────────────────────────────

export const TYPE_LABELS: Record<string, string> = {
  content: "Content",
  code: "Code",
  design: "Design",
  qc: "Qualitätssicherung",
}

// ── Kategorie → Farbklassen ─────────────────────────────────────────────

export const CATEGORY_COLORS: Record<string, string> = {
  "Content & Thought-Leader": "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Infrastruktur & KI": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Monetarisierung": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Kundenautomatisierung": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Analyse & Strategie": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "High-Level Vision": "bg-rose-500/10 text-rose-400 border-rose-500/20",
}
