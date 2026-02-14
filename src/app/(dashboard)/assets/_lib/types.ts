// ─── Asset Data (from API response) ──────────────────────────────────────────

export interface AssetData {
  id: string
  type: string
  storageKey: string
  projectId: string | null
  jobId: string | null
  publicUrl: string | null
  meta: string | null
  createdAt: string
  project?: {
    id: string
    name: string
    company?: {
      id: string
      name: string
    } | null
  } | null
  job?: {
    id: string
  } | null
}

// ─── File Tree Node ──────────────────────────────────────────────────────────

export interface FileNode {
  /** Unique ID for React keys and selection */
  id: string
  /** Display name (folder or file name) */
  name: string
  /** Node type */
  type: "folder" | "file"
  /** Full path from root (e.g. "TechVision GmbH/Projekt Q1/images/hero.png") */
  path: string
  /** Children nodes (only for folders) */
  children?: FileNode[]
  /** Asset data (only for files) */
  asset?: AssetData
  /** Depth in tree (for indentation) */
  level: number
  /** Whether folder is expanded */
  isExpanded?: boolean
  /** File count for folders */
  fileCount?: number
}

// ─── Component Props ─────────────────────────────────────────────────────────

export interface FileTreeNodeProps {
  node: FileNode
  selectedId: string | null
  onToggle: (nodeId: string) => void
  onSelect: (node: FileNode) => void
}

export interface FileTreeProps {
  nodes: FileNode[]
  selectedId: string | null
  onToggle: (nodeId: string) => void
  onSelect: (node: FileNode) => void
  isLoading?: boolean
}

export interface FilePreviewProps {
  asset: AssetData | null
}

export interface FileExplorerProps {
  assets: AssetData[]
  /** When true, groups only by storageKey path. When false, groups by Company → Project → path */
  groupByProject?: boolean
}
