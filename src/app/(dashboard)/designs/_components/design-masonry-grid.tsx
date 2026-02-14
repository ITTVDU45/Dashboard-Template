"use client"

import type { DesignData } from "../_lib/types"
import { DesignCard } from "./design-card"

interface DesignMasonryGridProps {
  designs: DesignData[]
  onTagClick?: (design: DesignData) => void
  onCollectionClick?: (design: DesignData) => void
  onStatusToggle?: (design: DesignData) => void
}

export function DesignMasonryGrid({
  designs,
  onTagClick,
  onCollectionClick,
  onStatusToggle,
}: DesignMasonryGridProps) {
  if (designs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-muted-foreground">Keine Designs gefunden</p>
        <p className="mt-1 text-xs text-muted-foreground">Versuche andere Filter oder importiere neue Designs.</p>
      </div>
    )
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 2xl:columns-4">
      {designs.map((design) => (
        <DesignCard
          key={design.id}
          design={design}
          onTagClick={onTagClick}
          onCollectionClick={onCollectionClick}
          onStatusToggle={onStatusToggle}
        />
      ))}
    </div>
  )
}
