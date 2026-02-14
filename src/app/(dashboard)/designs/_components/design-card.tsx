"use client"

import { useState } from "react"
import Link from "next/link"
import { Bookmark, ExternalLink, Tag, FolderPlus, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { DesignData } from "../_lib/types"
import { parseTags, getCoverImage } from "../_lib/helpers"
import { SOURCE_LABELS, SOURCE_COLORS, CATEGORY_LABELS } from "../_lib/constants"

interface DesignCardProps {
  design: DesignData
  onTagClick?: (design: DesignData) => void
  onCollectionClick?: (design: DesignData) => void
  onStatusToggle?: (design: DesignData) => void
}

export function DesignCard({ design, onTagClick, onCollectionClick, onStatusToggle }: DesignCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const coverImage = getCoverImage(design)
  const tags = parseTags(design.tags)

  return (
    <div
      className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link href={`/designs/${design.id}`} className="block">
        {coverImage ? (
          <div className="relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt={design.name}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-muted/50 to-muted">
            <Eye className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
      </Link>

      {/* Hover Overlay Actions */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute right-2 top-2 flex flex-col gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onStatusToggle?.(design) }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-white hover:text-amber-600"
            title={design.status === "saved" ? "Archivieren" : "Speichern"}
          >
            <Bookmark className={`h-4 w-4 ${design.status === "saved" ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onTagClick?.(design) }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-white hover:text-blue-600"
            title="Tags bearbeiten"
          >
            <Tag className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onCollectionClick?.(design) }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-white hover:text-green-600"
            title="Zu Collection hinzufügen"
          >
            <FolderPlus className="h-4 w-4" />
          </button>
          {design.sourceUrl && (
            <a
              href={design.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm transition-colors hover:bg-white hover:text-purple-600"
              title="Quelle öffnen"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {/* Click to Detail */}
        <Link href={`/designs/${design.id}`} className="absolute inset-0" />
      </div>

      {/* Card Footer */}
      <div className="p-3">
        <Link href={`/designs/${design.id}`} className="block">
          <h3 className="truncate text-sm font-semibold leading-tight">{design.name}</h3>
        </Link>
        {design.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{design.description}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1">
          {design.sourceType && (
            <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${SOURCE_COLORS[design.sourceType] || ""}`}>
              {SOURCE_LABELS[design.sourceType] || design.sourceType}
            </Badge>
          )}
          {design.category && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {CATEGORY_LABELS[design.category] || design.category}
            </Badge>
          )}
          {tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <span className="text-[10px] text-muted-foreground">+{tags.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  )
}
