"use client"

import { ChevronRight, FileCode2 } from "lucide-react"

interface TemplateBreadcrumbProps {
  /** Current file path, e.g. "src/components/Hero.tsx" */
  path: string | null
  /** Template name (root) */
  templateName: string
  /** Called when a folder segment is clicked */
  onNavigate?: (folderPath: string) => void
}

export function TemplateBreadcrumb({ path, templateName, onNavigate }: TemplateBreadcrumbProps) {
  if (!path) return null

  const segments = path.split("/").filter(Boolean)

  return (
    <nav className="flex items-center gap-0.5 overflow-x-auto text-xs" aria-label="Dateipfad">
      <button
        type="button"
        className="shrink-0 rounded px-1 py-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        onClick={() => onNavigate?.("")}
      >
        {templateName}
      </button>

      {segments.map((segment, i) => {
        const isLast = i === segments.length - 1
        const folderPath = segments.slice(0, i + 1).join("/")

        return (
          <span key={folderPath} className="flex items-center gap-0.5">
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
            {isLast ? (
              <span className="flex items-center gap-1 rounded px-1 py-0.5 font-medium text-foreground">
                <FileCode2 className="h-3 w-3 text-muted-foreground" />
                {segment}
              </span>
            ) : (
              <button
                type="button"
                className="shrink-0 rounded px-1 py-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => onNavigate?.(folderPath)}
              >
                {segment}
              </button>
            )}
          </span>
        )
      })}
    </nav>
  )
}
