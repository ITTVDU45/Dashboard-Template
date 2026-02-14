"use client"

import Link from "next/link"
import { ArrowLeft, ExternalLink, Edit, Bookmark, Archive, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { DesignData } from "../_lib/types"
import { parseTags } from "../_lib/helpers"
import {
  SOURCE_LABELS,
  SOURCE_COLORS,
  SOURCE_ICONS,
  CATEGORY_LABELS,
  INDUSTRY_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
} from "../_lib/constants"

interface DesignDetailHeaderProps {
  design: DesignData
  onStatusChange?: (status: string) => void
}

export function DesignDetailHeader({ design, onStatusChange }: DesignDetailHeaderProps) {
  const tags = parseTags(design.tags)
  const SourceIcon = SOURCE_ICONS[design.sourceType]

  return (
    <div className="space-y-4">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/designs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Galerie
        </Link>

        <div className="flex items-center gap-2">
          {design.sourceUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={design.sourceUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Quelle öffnen
              </a>
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href={`/designs/${design.id}/edit`}>
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              Bearbeiten
            </Link>
          </Button>
          {onStatusChange && (
            <>
              {design.status !== "candidate" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange("candidate")}
                >
                  <FileCheck className="mr-1.5 h-3.5 w-3.5" />
                  Als Template-Kandidat markieren
                </Button>
              )}
              {design.status !== "archived" ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStatusChange("archived")}
                >
                  <Archive className="mr-1.5 h-3.5 w-3.5" />
                  Archivieren
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStatusChange("saved")}
                >
                  <Bookmark className="mr-1.5 h-3.5 w-3.5" />
                  Wiederherstellen
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Title + Badges */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{design.name}</h1>
        {design.description && (
          <p className="mt-1 text-muted-foreground">{design.description}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {/* Source Badge */}
          <Badge className={`${SOURCE_COLORS[design.sourceType] || ""}`}>
            {SourceIcon && <SourceIcon className="mr-1 h-3 w-3" />}
            {SOURCE_LABELS[design.sourceType] || design.sourceType}
          </Badge>

          {/* Status Badge */}
          <Badge className={STATUS_COLORS[design.status] || ""}>
            {STATUS_LABELS[design.status] || design.status}
          </Badge>

          {/* Category */}
          {design.category && (
            <Badge variant="outline">
              {CATEGORY_LABELS[design.category] || design.category}
            </Badge>
          )}

          {/* Industry */}
          {design.industry && (
            <Badge variant="outline">
              {INDUSTRY_LABELS[design.industry] || design.industry}
            </Badge>
          )}

          {/* Tags */}
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
