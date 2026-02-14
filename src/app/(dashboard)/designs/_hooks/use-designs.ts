"use client"

import { useCallback, useEffect, useState } from "react"
import type { DesignData, DesignFilters, DesignSortKey, CollectionData } from "../_lib/types"
import { filterDesigns, sortDesigns } from "../_lib/helpers"

const EMPTY_FILTERS: DesignFilters = {
  search: "",
  category: "",
  industry: "",
  sourceType: "",
  status: "",
  collection: "",
}

export function useDesigns() {
  const [allDesigns, setAllDesigns] = useState<DesignData[]>([])
  const [collections, setCollections] = useState<CollectionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<DesignFilters>(EMPTY_FILTERS)
  const [sort, setSort] = useState<DesignSortKey>("newest")

  const fetchDesigns = useCallback(async () => {
    setIsLoading(true)
    try {
      const [designsRes, collectionsRes] = await Promise.all([
        fetch("/api/designs"),
        fetch("/api/collections"),
      ])
      const designsPayload = await designsRes.json()
      const collectionsPayload = await collectionsRes.json()
      setAllDesigns(designsPayload.data ?? [])
      setCollections(collectionsPayload.data ?? [])
    } catch (err) {
      console.error("Fehler beim Laden der Designs:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchDesigns() }, [fetchDesigns])

  const filtered = filterDesigns(allDesigns, filters)
  const designs = sortDesigns(filtered, sort)

  function updateFilter(key: keyof DesignFilters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS)
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== "")

  return {
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
    refetch: fetchDesigns,
  }
}
