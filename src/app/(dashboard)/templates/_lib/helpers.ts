import { TEMPLATE_ICON_MAP, TEMPLATE_ICON_FALLBACK } from "./constants"
import type { TemplateData, TemplateFileNode, TemplateIconResult } from "./types"

// ─── Parse JSON tags ─────────────────────────────────────────────────────────

export function parseTags(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// ─── Parse file tree snapshot ────────────────────────────────────────────────

export function parseFileTree(raw: string | null): TemplateFileNode[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// ─── Get template icon by name ───────────────────────────────────────────────

export function getTemplateIcon(name: string): TemplateIconResult {
  const lower = name.toLowerCase()
  for (const entry of TEMPLATE_ICON_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return { icon: entry.icon, gradient: entry.gradient }
    }
  }
  return TEMPLATE_ICON_FALLBACK
}

// ─── Extract unique categories ───────────────────────────────────────────────

export function extractCategories(templates: TemplateData[]): string[] {
  const set = new Set<string>()
  for (const t of templates) {
    if (t.category) set.add(t.category)
  }
  return Array.from(set).sort()
}

// ─── Extract unique frameworks ───────────────────────────────────────────────

export function extractFrameworks(templates: TemplateData[]): string[] {
  const set = new Set<string>()
  for (const t of templates) {
    if (t.framework) set.add(t.framework)
  }
  return Array.from(set).sort()
}

// ─── Filter templates ────────────────────────────────────────────────────────

export function filterTemplates(
  templates: TemplateData[],
  search: string,
  type: string | null,
  category: string | null,
  framework: string | null,
  source: string | null
): TemplateData[] {
  return templates.filter((t) => {
    if (type && t.type !== type) return false
    if (category && t.category !== category) return false
    if (framework && t.framework !== framework) return false
    if (source && t.sourceMode !== source) return false

    if (search.trim()) {
      const tags = parseTags(t.tags)
      const haystack = `${t.name} ${t.slug} ${t.description || ""} ${tags.join(" ")} ${t.category || ""} ${t.framework}`.toLowerCase()
      if (!haystack.includes(search.trim().toLowerCase())) return false
    }

    return true
  })
}

// ─── Relative time ───────────────────────────────────────────────────────────

export function relativeTime(dateStr: string | null): string {
  if (!dateStr) return "–"
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "gerade eben"
  if (minutes < 60) return `vor ${minutes} Min.`
  if (hours < 24) return `vor ${hours} Std.`
  if (days < 7) return `vor ${days} ${days === 1 ? "Tag" : "Tagen"}`
  if (days < 30) return `vor ${Math.floor(days / 7)} Wochen`
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })
}

// ─── GitHub URL builder ──────────────────────────────────────────────────────

export function buildGitHubUrl(
  repoFullName: string | null,
  branch?: string | null,
  path?: string | null
): string | null {
  if (!repoFullName) return null
  let url = `https://github.com/${repoFullName}`
  if (branch && path) {
    url += `/tree/${branch}${path.startsWith("/") ? path : `/${path}`}`
  } else if (branch) {
    url += `/tree/${branch}`
  }
  return url
}

// ─── Get file extension ──────────────────────────────────────────────────────

export function getFileExtension(filename: string): string {
  const parts = filename.split(".")
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ""
}
