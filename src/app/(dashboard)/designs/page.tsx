"use client"

import { useState, useCallback } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/common/page-header"
import { useDesigns } from "./_hooks/use-designs"
import { DesignFiltersBar } from "./_components/design-filters-bar"
import { DesignMasonryGrid } from "./_components/design-masonry-grid"
import { DesignImportModal } from "./_components/design-import-modal"
import { DesignTagPopover } from "./_components/design-tag-popover"
import { DesignCollectionPopover } from "./_components/design-collection-popover"
import type { DesignData } from "./_lib/types"
import { parseStringArray } from "./_lib/helpers"

export default function DesignsPage() {
  const {
    designs,
    allDesigns,
    collections,
    isLoading,
    filters,
    sort,
    setSort,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    refetch,
  } = useDesigns()

  const [importOpen, setImportOpen] = useState(false)

  // Tag Popover State
  const [tagTarget, setTagTarget] = useState<DesignData | null>(null)
  const [tagOpen, setTagOpen] = useState(false)

  // Collection Popover State
  const [collectionTarget, setCollectionTarget] = useState<DesignData | null>(null)
  const [collectionOpen, setCollectionOpen] = useState(false)

  function handleTagClick(design: DesignData) {
    setTagTarget(design)
    setTagOpen(true)
  }

  function handleCollectionClick(design: DesignData) {
    setCollectionTarget(design)
    setCollectionOpen(true)
  }

  async function handleStatusToggle(design: DesignData) {
    const newStatus = design.status === "saved" ? "archived" : "saved"
    await fetch(`/api/designs/${design.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    refetch()
  }

  const handleTagSave = useCallback(async (designId: string, tags: string[]) => {
    await fetch(`/api/designs/${designId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags }),
    })
    refetch()
  }, [refetch])

  const handleCollectionToggle = useCallback(async (designId: string, collectionId: string, add: boolean) => {
    // Get current design's collections
    const design = allDesigns.find((d) => d.id === designId)
    if (!design) return
    const current = parseStringArray(design.collectionIds)
    const updated = add
      ? [...current, collectionId]
      : current.filter((id) => id !== collectionId)

    await fetch(`/api/designs/${designId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collectionIds: updated }),
    })
    refetch()
  }, [allDesigns, refetch])

  const handleCreateCollection = useCallback(async (name: string) => {
    await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    refetch()
  }, [refetch])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Designs (Inspiration)"
        description="Dribbble-Referenzen, Screenshots und Inspirationen als Galerie"
      >
        <Button onClick={() => setImportOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Design importieren
        </Button>
      </PageHeader>

      <DesignFiltersBar
        filters={filters}
        sort={sort}
        onFilterChange={updateFilter}
        onSortChange={setSort}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        totalCount={allDesigns.length}
        filteredCount={designs.length}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <DesignMasonryGrid
          designs={designs}
          onTagClick={handleTagClick}
          onCollectionClick={handleCollectionClick}
          onStatusToggle={handleStatusToggle}
        />
      )}

      {/* Import Modal */}
      <DesignImportModal
        open={importOpen}
        onOpenChange={setImportOpen}
        onImportComplete={refetch}
      />

      {/* Tag Popover (rendered as portal) */}
      <DesignTagPopover
        design={tagTarget}
        open={tagOpen}
        onOpenChange={setTagOpen}
        onSave={handleTagSave}
      />

      {/* Collection Popover (rendered as portal) */}
      <DesignCollectionPopover
        design={collectionTarget}
        collections={collections}
        open={collectionOpen}
        onOpenChange={setCollectionOpen}
        onToggle={handleCollectionToggle}
        onCreateCollection={handleCreateCollection}
      />
    </div>
  )
}
