"use client"

import Link from "next/link"
import { ExternalLink, RefreshCw, Eye, Github, HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { TemplateData } from "../_lib/types"
import {
  TYPE_LABELS,
  TYPE_COLORS,
  FRAMEWORK_LABELS,
  FRAMEWORK_COLORS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  SOURCE_LABELS,
} from "../_lib/constants"
import { getTemplateIcon, parseTags, buildGitHubUrl } from "../_lib/helpers"
import { TemplateSyncBadge } from "./template-sync-badge"

interface TemplatePreviewPanelProps {
  template: TemplateData | null
  isSyncing: boolean
  onSync: (id: string) => void
}

export function TemplatePreviewPanel({
  template,
  isSyncing,
  onSync,
}: TemplatePreviewPanelProps) {
  if (!template) {
    return (
      <div className="flex flex-1 items-center justify-center bg-muted/20 p-12 text-center">
        <div>
          <div className="mx-auto h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center">
            <Eye className="h-12 w-12 text-muted-foreground/30" />
          </div>
          <p className="mt-6 text-sm font-medium text-foreground">
            Kein Template ausgewählt
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Wähle ein Template aus der Liste, um die Vorschau anzuzeigen
          </p>
        </div>
      </div>
    )
  }

  const { icon: Icon, gradient } = getTemplateIcon(template.name)
  const tags = parseTags(template.tags)
  const githubUrl = buildGitHubUrl(
    template.repoFullName,
    template.defaultBranch,
    template.templateRootPath
  )

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-background">
      {/* Preview Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b bg-muted">
        {template.previewImageUrl ? (
          <img
            src={template.previewImageUrl}
            alt={template.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center bg-gradient-to-br",
              gradient
            )}
          >
            <Icon className="h-24 w-24 text-white/60" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 p-8">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {template.name}
              </h2>
              {template.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {template.description}
                </p>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {/* Type Badge */}
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                TYPE_COLORS[template.type] || "bg-muted text-muted-foreground"
              )}
            >
              {TYPE_LABELS[template.type] || template.type}
            </span>

            {/* Category Badge */}
            {template.category && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                  CATEGORY_COLORS[template.category] ||
                    "bg-muted text-muted-foreground border-border"
                )}
              >
                {CATEGORY_LABELS[template.category] || template.category}
              </span>
            )}

            {/* Framework Badge */}
            <span
              className={cn(
                "rounded px-2 py-0.5 text-xs font-medium",
                FRAMEWORK_COLORS[template.framework] || "bg-muted text-muted-foreground"
              )}
            >
              {FRAMEWORK_LABELS[template.framework] || template.framework}
            </span>

            {/* Source Badge */}
            <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {template.sourceMode === "github" ? (
                <Github className="h-3 w-3" />
              ) : (
                <HardDrive className="h-3 w-3" />
              )}
              {SOURCE_LABELS[template.sourceMode]}
            </span>

            {/* Sync Status */}
            {template.sourceMode === "github" && (
              <TemplateSyncBadge status={template.syncStatus} />
            )}
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-xs text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 rounded-lg border bg-muted/20 p-4">
          <div>
            <p className="text-xs text-muted-foreground">Typ</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {TYPE_LABELS[template.type]}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Framework</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {FRAMEWORK_LABELS[template.framework]}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Verwendet</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {template.usesCount}x
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button asChild className="gap-2">
            <Link href={`/templates/${template.id}`}>
              <Eye className="h-4 w-4" />
              Details ansehen
            </Link>
          </Button>

          {githubUrl && (
            <Button variant="outline" className="gap-2" asChild>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Auf GitHub
              </a>
            </Button>
          )}

          {template.sourceMode === "github" && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => onSync(template.id)}
              disabled={isSyncing}
            >
              <RefreshCw
                className={cn("h-4 w-4", isSyncing && "animate-spin")}
              />
              Sync starten
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
