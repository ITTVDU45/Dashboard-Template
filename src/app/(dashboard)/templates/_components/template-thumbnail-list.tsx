"use client"

import { useRouter } from "next/navigation"
import { FileCode2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TemplateData } from "../_lib/types"
import { getTemplateIcon } from "../_lib/helpers"

interface TemplateThumbnailListProps {
  templates: TemplateData[]
  selectedId: string | null
  onSelect: (id: string) => void
  isLoading: boolean
}

function ThumbnailSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="aspect-[3/4] animate-pulse bg-muted" />
      <div className="p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

function ThumbnailCard({
  template,
  isSelected,
  onSelect,
  onNavigate,
}: {
  template: TemplateData
  isSelected: boolean
  onSelect: () => void
  onNavigate: () => void
}) {
  const { icon: Icon, gradient } = getTemplateIcon(template.name)

  return (
    <button
      onClick={onSelect}
      onDoubleClick={onNavigate}
      className={cn(
        "group w-full overflow-hidden rounded-xl border text-left transition-all",
        "hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        isSelected
          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 ring-1 ring-primary/30"
          : "border-border bg-card"
      )}
    >
      {/* Thumbnail – 3:4 portrait ratio for full page preview */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {template.previewImageUrl ? (
          <img
            src={template.previewImageUrl}
            alt={template.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center justify-center bg-gradient-to-br",
              gradient
            )}
          >
            <Icon className="h-20 w-20 text-white/70" />
          </div>
        )}

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute inset-0 bg-primary/10 ring-2 ring-inset ring-primary/60" />
        )}
      </div>

      {/* Name + Meta */}
      <div className="p-4">
        <h4
          className={cn(
            "line-clamp-2 text-base font-semibold leading-snug transition-colors",
            isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
          )}
        >
          {template.name}
        </h4>
        <p className="mt-1.5 truncate text-sm text-muted-foreground">
          {template.type === "project"
            ? "Projekt"
            : template.type === "component"
              ? "Komponente"
              : "Section"}
          {template.category && ` · ${template.category}`}
        </p>
      </div>
    </button>
  )
}

export function TemplateThumbnailList({
  templates,
  selectedId,
  onSelect,
  isLoading,
}: TemplateThumbnailListProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex w-[420px] shrink-0 flex-col gap-4 overflow-y-auto border-r bg-background p-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <ThumbnailSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="flex w-[420px] shrink-0 flex-col items-center justify-center border-r bg-background p-10 text-center">
        <FileCode2 className="h-14 w-14 text-muted-foreground/30" />
        <p className="mt-4 text-base font-medium text-foreground">
          Keine Templates gefunden
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Versuche einen anderen Filter oder Suchbegriff
        </p>
      </div>
    )
  }

  return (
    <div className="flex w-[420px] shrink-0 flex-col gap-4 overflow-y-auto border-r bg-background p-5">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-medium text-muted-foreground">
          {templates.length} {templates.length === 1 ? "Template" : "Templates"}
        </span>
      </div>

      {/* Thumbnail Cards */}
      {templates.map((template) => (
        <ThumbnailCard
          key={template.id}
          template={template}
          isSelected={selectedId === template.id}
          onSelect={() => onSelect(template.id)}
          onNavigate={() => router.push(`/templates/${template.id}`)}
        />
      ))}
    </div>
  )
}
