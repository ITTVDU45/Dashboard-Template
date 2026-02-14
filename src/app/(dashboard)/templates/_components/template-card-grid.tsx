"use client"

import { FileCode2 } from "lucide-react"
import { EmptyState } from "@/components/common/empty-state"
import type { TemplateData } from "../_lib/types"
import { TemplateCard } from "./template-card"

interface TemplateCardGridProps {
  templates: TemplateData[]
  totalCount: number
  isLoading: boolean
  hasQuery: boolean
  syncingId: string | null
  onSync: (id: string) => void
}

function TemplateCardSkeleton() {
  return <div className="h-72 animate-pulse rounded-2xl border border-border bg-card" />
}

export function TemplateCardGrid({
  templates,
  totalCount,
  isLoading,
  hasQuery,
  syncingId,
  onSync,
}: TemplateCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <TemplateCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <EmptyState
        icon={FileCode2}
        title="Keine Templates gefunden"
        description={
          hasQuery
            ? "Versuche einen anderen Suchbegriff oder andere Filter."
            : "Templates sind wiederverwendbare Projekte & Sections. Importiere aus GitHub oder lege lokal an."
        }
        action={!hasQuery ? { label: "Template hinzufügen", href: "/templates/new" } : undefined}
      />
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates.map((template, index) => (
          <TemplateCard
            key={template.id}
            template={template}
            index={index}
            isSyncing={syncingId === template.id}
            onSync={onSync}
          />
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {templates.length} von {totalCount} Templates angezeigt
      </p>
    </>
  )
}
