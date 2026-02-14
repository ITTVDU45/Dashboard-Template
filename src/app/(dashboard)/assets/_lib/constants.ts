import {
  File,
  Folder,
  FolderOpen,
  Image,
  Video,
  FileCode2,
  FileJson,
  FileText,
  Archive,
  Globe,
  type LucideIcon,
} from "lucide-react"

// ─── File Type → Icon Mapping ────────────────────────────────────────────────

export const FILE_TYPE_ICONS: Record<string, LucideIcon> = {
  image: Image,
  video: Video,
  gif: Image,
  html: FileCode2,
  bundle: Archive,
  report: FileJson,
  document: FileText,
  default: File,
}

// ─── Folder Icons ────────────────────────────────────────────────────────────

export const FOLDER_ICON_CLOSED = Folder
export const FOLDER_ICON_OPEN = FolderOpen

// ─── File Type → Badge Color Mapping ─────────────────────────────────────────

export const FILE_TYPE_COLORS: Record<string, string> = {
  image: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  video: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  gif: "bg-pink-500/15 text-pink-600 dark:text-pink-400",
  html: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  bundle: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  report: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  document: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
  default: "bg-muted text-muted-foreground",
}

// ─── File Type → German Label ────────────────────────────────────────────────

export const FILE_TYPE_LABELS: Record<string, string> = {
  image: "Bild",
  video: "Video",
  gif: "GIF",
  html: "HTML",
  bundle: "Bundle",
  report: "Bericht",
  document: "Dokument",
}

// ─── Link Icon ───────────────────────────────────────────────────────────────

export const LINK_ICON = Globe
