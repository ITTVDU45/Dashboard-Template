import type { LucideIcon } from "lucide-react"

// ─── Template Data (from API) ────────────────────────────────────────────────

export interface TemplateData {
  id: string
  name: string
  slug: string
  description: string | null
  type: string        // "project" | "component" | "section"
  category: string | null
  framework: string   // "nextjs" | "react" | "html" | "mixed"
  uiStack: string | null
  tags: string | null  // JSON string
  layoutCode: string | null
  placeholdersSchema: string | null
  previewImageUrl: string | null
  sourceMode: string  // "github" | "local"
  repoFullName: string | null
  defaultBranch: string | null
  templateRootPath: string | null
  pinnedPaths: string | null
  readmePath: string | null
  entryFile: string | null
  syncStatus: string  // "none" | "synced" | "out_of_sync" | "syncing" | "error"
  lastSyncAt: string | null
  lastCommitSha: string | null
  syncErrorMessage: string | null
  fileTreeSnapshot: string | null
  usesCount: number
  lastUsedAt: string | null
  createdAt: string
  updatedAt: string
}

// ─── Template File Tree Node ─────────────────────────────────────────────────

export interface TemplateFileNode {
  name: string
  type: "file" | "folder"
  path: string
  children?: TemplateFileNode[]
  /** File size hint (e.g. "2.4KB") */
  size?: string
  /** Language hint for syntax highlighting */
  language?: string
}

// ─── Viewer Tab ──────────────────────────────────────────────────────────────

export type ViewerTab = "preview" | "readme" | "code" | "meta" | "history" | "editor"

// ─── Icon Mapping ────────────────────────────────────────────────────────────

export interface TemplateIconEntry {
  keywords: string[]
  icon: LucideIcon
  gradient: string
}

export interface TemplateIconResult {
  icon: LucideIcon
  gradient: string
}

// ─── Filter State ────────────────────────────────────────────────────────────

export type SortOption = "updated" | "name" | "uses" | "created"

export interface TemplateFiltersState {
  search: string
  type: string | null
  category: string | null
  framework: string | null
  source: string | null
  sort: SortOption
}
