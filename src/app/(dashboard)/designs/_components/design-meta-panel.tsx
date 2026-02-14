"use client"

import {
  Globe,
  User,
  Calendar,
  Tag,
  BarChart3,
  Layers,
  Building2,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DesignData } from "../_lib/types"
import { parseTags, relativeTime, parseStringArray } from "../_lib/helpers"
import {
  SOURCE_LABELS,
  CATEGORY_LABELS,
  INDUSTRY_LABELS,
  STATUS_LABELS,
} from "../_lib/constants"

interface DesignMetaPanelProps {
  design: DesignData
}

interface MetaRowProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}

function MetaRow({ icon, label, value }: MetaRowProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  )
}

export function DesignMetaPanel({ design }: DesignMetaPanelProps) {
  const tags = parseTags(design.tags)
  const collectionIds = parseStringArray(design.collectionIds)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Metadaten</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">
        {/* Source */}
        <MetaRow
          icon={<Globe className="h-4 w-4" />}
          label="Quelle"
          value={
            <div className="flex items-center gap-1.5">
              <span>{SOURCE_LABELS[design.sourceType] || design.sourceType}</span>
              {design.sourceUrl && (
                <a
                  href={design.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          }
        />

        {/* Author (Dribbble user) */}
        {design.dribbbleUser && (
          <MetaRow
            icon={<User className="h-4 w-4" />}
            label="Autor"
            value={design.dribbbleUser}
          />
        )}

        {/* Category */}
        {design.category && (
          <MetaRow
            icon={<Layers className="h-4 w-4" />}
            label="Kategorie"
            value={CATEGORY_LABELS[design.category] || design.category}
          />
        )}

        {/* Industry */}
        {design.industry && (
          <MetaRow
            icon={<Building2 className="h-4 w-4" />}
            label="Branche"
            value={INDUSTRY_LABELS[design.industry] || design.industry}
          />
        )}

        {/* Status */}
        <MetaRow
          icon={<BarChart3 className="h-4 w-4" />}
          label="Status"
          value={STATUS_LABELS[design.status] || design.status}
        />

        {/* Uses */}
        <MetaRow
          icon={<BarChart3 className="h-4 w-4" />}
          label="Verwendet"
          value={`${design.usesCount}×`}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <MetaRow
            icon={<Tag className="h-4 w-4" />}
            label="Tags"
            value={
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            }
          />
        )}

        {/* Collections */}
        {collectionIds.length > 0 && (
          <MetaRow
            icon={<Layers className="h-4 w-4" />}
            label="Collections"
            value={`${collectionIds.length} Collection(s)`}
          />
        )}

        {/* Dates */}
        <MetaRow
          icon={<Calendar className="h-4 w-4" />}
          label="Erstellt"
          value={relativeTime(design.createdAt)}
        />
        <MetaRow
          icon={<Calendar className="h-4 w-4" />}
          label="Aktualisiert"
          value={relativeTime(design.updatedAt)}
        />

        {/* Notes */}
        {design.notes && (
          <div className="pt-3">
            <p className="text-xs text-muted-foreground mb-1">Notizen</p>
            <p className="text-sm whitespace-pre-wrap">{design.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
