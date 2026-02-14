"use client"

import { cn } from "@/lib/utils"
import type { TemplateData } from "../_lib/types"
import {
  TYPE_LABELS,
  TYPE_COLORS,
  FRAMEWORK_LABELS,
  CATEGORY_LABELS,
} from "../_lib/constants"
import { getTemplateIcon, parseTags } from "../_lib/helpers"

interface TemplatePreviewTabProps {
  template: TemplateData
}

export function TemplatePreviewTab({ template }: TemplatePreviewTabProps) {
  const { icon: Icon, gradient } = getTemplateIcon(template.name)
  const tags = parseTags(template.tags)

  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      {/* Preview Image */}
      <div className="w-full max-w-4xl overflow-hidden rounded-xl border shadow-lg">
        {template.previewImageUrl ? (
          <img
            src={template.previewImageUrl}
            alt={template.name}
            className="h-auto w-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "flex aspect-video w-full items-center justify-center bg-gradient-to-br",
              gradient
            )}
          >
            <Icon className="h-32 w-32 text-white/60" />
          </div>
        )}
      </div>

      {/* Meta Information */}
      <div className="w-full max-w-4xl space-y-6">
        {/* Title & Description */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">{template.name}</h2>
          {template.description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {template.description}
            </p>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium",
              TYPE_COLORS[template.type] || "bg-muted text-muted-foreground"
            )}
          >
            {TYPE_LABELS[template.type] || template.type}
          </span>

          {template.category && (
            <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-foreground">
              {CATEGORY_LABELS[template.category] || template.category}
            </span>
          )}

          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
            {FRAMEWORK_LABELS[template.framework] || template.framework}
          </span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-sm text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/20 p-6 md:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Typ
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {TYPE_LABELS[template.type]}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Framework
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {FRAMEWORK_LABELS[template.framework]}
            </p>
          </div>
          {template.uiStack && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                UI-Stack
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {template.uiStack}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Verwendet
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {template.usesCount}x
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
