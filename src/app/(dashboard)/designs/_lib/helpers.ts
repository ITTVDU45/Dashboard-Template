import type { DesignData, DesignFilters, ImageData } from "./types"

// ── JSON Parsing ─────────────────────────────────────────────────────────────

export function parseTags(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((t: unknown) => typeof t === "string") : []
  } catch {
    return []
  }
}

export function parseImages(raw: string | null): ImageData[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function parseStringArray(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// ── Dedupe Key ───────────────────────────────────────────────────────────────

export function generateDedupeKey(
  sourceType: string,
  sourceUrl?: string | null,
  dribbbleId?: string | null
): string | null {
  if (sourceType === "dribbble" && dribbbleId) {
    return `dribbble:${dribbbleId}`
  }
  if (sourceType === "web" && sourceUrl) {
    const normalized = sourceUrl
      .toLowerCase()
      .replace(/^https?:\/\/(www\.)?/, "")
      .replace(/\/$/, "")
    return `web:${normalized}`
  }
  return null
}

// ── Cover Image ──────────────────────────────────────────────────────────────

export function getCoverImage(design: DesignData): string | null {
  if (design.coverImageUrl) return design.coverImageUrl
  if (design.screenshotUrl) return design.screenshotUrl
  const images = parseImages(design.images)
  const cover = images.find((img) => img.kind === "cover")
  if (cover) return cover.url
  if (images.length > 0) return images[0].url
  return null
}

// ── Filtering ────────────────────────────────────────────────────────────────

export function filterDesigns(
  designs: DesignData[],
  filters: DesignFilters
): DesignData[] {
  return designs.filter((d) => {
    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const tags = parseTags(d.tags).join(" ").toLowerCase()
      const haystack = `${d.name} ${d.description || ""} ${tags} ${d.sourceUrl || ""} ${d.dribbbleUser || ""}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }

    // Category
    if (filters.category && d.category !== filters.category) return false

    // Industry
    if (filters.industry && d.industry !== filters.industry) return false

    // Source type
    if (filters.sourceType && d.sourceType !== filters.sourceType) return false

    // Status
    if (filters.status && d.status !== filters.status) return false

    // Collection
    if (filters.collection) {
      const ids = parseStringArray(d.collectionIds)
      if (!ids.includes(filters.collection)) return false
    }

    return true
  })
}

// ── Sorting ──────────────────────────────────────────────────────────────────

export function sortDesigns(
  designs: DesignData[],
  sort: string
): DesignData[] {
  const copy = [...designs]
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case "updated":
      return copy.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    case "uses":
      return copy.sort((a, b) => b.usesCount - a.usesCount)
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return copy
  }
}

// ── Relative Time ────────────────────────────────────────────────────────────

export function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "gerade eben"
  if (minutes < 60) return `vor ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `vor ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `vor ${days}d`
  const months = Math.floor(days / 30)
  return `vor ${months} Mon.`
}

// ── Extract unique categories / industries from designs ──────────────────────

export function extractCategories(designs: DesignData[]): string[] {
  const set = new Set<string>()
  designs.forEach((d) => { if (d.category) set.add(d.category) })
  return Array.from(set).sort()
}

export function extractIndustries(designs: DesignData[]): string[] {
  const set = new Set<string>()
  designs.forEach((d) => { if (d.industry) set.add(d.industry) })
  return Array.from(set).sort()
}
