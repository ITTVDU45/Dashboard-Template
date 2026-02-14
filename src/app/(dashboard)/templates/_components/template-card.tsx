"use client"

import Link from "next/link"
import { Eye, RefreshCw, Github, HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  TYPE_LABELS,
  TYPE_COLORS,
  FRAMEWORK_LABELS,
  FRAMEWORK_COLORS,
  CATEGORY_LABELS,
  SOURCE_LABELS,
} from "../_lib/constants"
import { getTemplateIcon, parseTags, relativeTime } from "../_lib/helpers"
import { TemplateSyncBadge } from "./template-sync-badge"
import type { TemplateData } from "../_lib/types"

interface TemplateCardProps {
  template: TemplateData
  index: number
  isSyncing: boolean
  onSync: (id: string) => void
}

export function TemplateCard({ template, index, isSyncing, onSync }: TemplateCardProps) {
  const { icon: Icon, gradient } = getTemplateIcon(template.name)
  const tags = parseTags(template.tags)
  const maxTags = 3
  const extraTags = tags.length > maxTags ? tags.length - maxTags : 0

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in motion-reduce:animate-none"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Type Badge - top right */}
      <div className="absolute right-3 top-3 z-10">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
            TYPE_COLORS[template.type] || "bg-muted text-muted-foreground"
          )}
        >
          {TYPE_LABELS[template.type] || template.type}
        </span>
      </div>

      {/* Header: Icon + Name */}
      <div className="flex items-start gap-3 p-4 pb-0">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0 flex-1 pr-14">
          <h3 className="truncate text-sm font-semibold leading-tight text-foreground">
            {template.name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-medium",
                FRAMEWORK_COLORS[template.framework] || "bg-muted text-muted-foreground"
              )}
            >
              {FRAMEWORK_LABELS[template.framework] || template.framework}
            </span>
            {template.category && (
              <span className="truncate text-[10px] text-muted-foreground">
                {CATEGORY_LABELS[template.category] || template.category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="flex-1 px-4 py-3">
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {template.description || "Keine Beschreibung vorhanden."}
        </p>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 px-4 pb-2">
          {tags.slice(0, maxTags).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {extraTags > 0 && (
            <span className="rounded-md px-1.5 py-0.5 text-[10px] text-muted-foreground/60">
              +{extraTags}
            </span>
          )}
        </div>
      )}

      {/* Meta row: source + sync + updated */}
      <div className="flex items-center gap-3 px-4 pb-2">
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/70">
          {template.sourceMode === "github" ? (
            <Github className="h-3 w-3" />
          ) : (
            <HardDrive className="h-3 w-3" />
          )}
          {SOURCE_LABELS[template.sourceMode] || template.sourceMode}
        </span>

        {template.sourceMode === "github" && (
          <TemplateSyncBadge status={template.syncStatus} />
        )}

        <span className="ml-auto text-[10px] text-muted-foreground/50">
          {relativeTime(template.updatedAt)}
        </span>
      </div>

      {/* Footer: Actions */}
      <div className="flex items-center gap-2 border-t border-border px-4 py-3">
        {template.sourceMode === "github" && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onSync(template.id)}
            disabled={isSyncing}
          >
            <RefreshCw className={cn("h-3 w-3", isSyncing && "animate-spin")} />
            Sync
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href={`/templates/${template.id}`}>
            <Eye className="h-3 w-3" />
            Details
          </Link>
        </Button>
      </div>
    </div>
  )
}
