"use client"

import Link from "next/link"
import { ExternalLink, RefreshCw, Pencil, Github, HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  TYPE_LABELS,
  TYPE_COLORS,
  FRAMEWORK_LABELS,
  FRAMEWORK_COLORS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  SOURCE_LABELS,
  UI_STACK_LABELS,
} from "../_lib/constants"
import { TemplateSyncBadge } from "./template-sync-badge"
import { buildGitHubUrl, relativeTime } from "../_lib/helpers"
import type { TemplateData } from "../_lib/types"

interface TemplateDetailHeaderProps {
  template: TemplateData
  isSyncing: boolean
  onSync: () => void
}

export function TemplateDetailHeader({ template, isSyncing, onSync }: TemplateDetailHeaderProps) {
  const githubUrl = buildGitHubUrl(
    template.repoFullName,
    template.defaultBranch,
    template.templateRootPath
  )

  return (
    <div className="space-y-4">
      {/* Title + Badges */}
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-foreground">{template.name}</h1>
          {template.description && (
            <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
          )}

          {/* Badge row */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Type */}
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                TYPE_COLORS[template.type] || "bg-muted text-muted-foreground"
              )}
            >
              {TYPE_LABELS[template.type] || template.type}
            </span>

            {/* Category */}
            {template.category && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                  CATEGORY_COLORS[template.category] || "bg-muted text-muted-foreground border-border"
                )}
              >
                {CATEGORY_LABELS[template.category] || template.category}
              </span>
            )}

            {/* Framework */}
            <span
              className={cn(
                "rounded px-2 py-0.5 text-[11px] font-medium",
                FRAMEWORK_COLORS[template.framework] || "bg-muted text-muted-foreground"
              )}
            >
              {FRAMEWORK_LABELS[template.framework] || template.framework}
            </span>

            {/* UI Stack */}
            {template.uiStack && (
              <span className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                {UI_STACK_LABELS[template.uiStack] || template.uiStack}
              </span>
            )}

            {/* Source */}
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              {template.sourceMode === "github" ? (
                <Github className="h-3.5 w-3.5" />
              ) : (
                <HardDrive className="h-3.5 w-3.5" />
              )}
              {SOURCE_LABELS[template.sourceMode]}
              {template.repoFullName && (
                <span className="text-foreground/60">{template.repoFullName}</span>
              )}
            </span>

            {/* Sync Status */}
            {template.sourceMode === "github" && (
              <TemplateSyncBadge status={template.syncStatus} />
            )}

            {/* Updated */}
            <span className="text-[11px] text-muted-foreground/50">
              Aktualisiert {relativeTime(template.updatedAt)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex shrink-0 items-center gap-2">
          {githubUrl && (
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                Auf GitHub
              </a>
            </Button>
          )}

          {template.sourceMode === "github" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={onSync}
              disabled={isSyncing}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isSyncing && "animate-spin")} />
              Sync
            </Button>
          )}

          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <Link href={`/templates/${template.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
              Bearbeiten
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
