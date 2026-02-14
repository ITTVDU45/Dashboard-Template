"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { TemplateData, SortOption } from "../_lib/types"
import { extractCategories, extractFrameworks, filterTemplates } from "../_lib/helpers"

interface UseTemplatesReturn {
  templates: TemplateData[]
  filtered: TemplateData[]
  categories: string[]
  frameworks: string[]
  isLoading: boolean
  // Search
  search: string
  setSearch: (v: string) => void
  // Filters
  filterType: string | null
  setFilterType: (v: string | null) => void
  filterCategory: string | null
  setFilterCategory: (v: string | null) => void
  filterFramework: string | null
  setFilterFramework: (v: string | null) => void
  filterSource: string | null
  setFilterSource: (v: string | null) => void
  // Sort
  sort: SortOption
  setSort: (v: SortOption) => void
  // Actions
  handleSync: (templateId: string) => Promise<void>
  syncingId: string | null
  refetch: () => void
}

export function useTemplates(): UseTemplatesReturn {
  const [templates, setTemplates] = useState<TemplateData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterFramework, setFilterFramework] = useState<string | null>(null)
  const [filterSource, setFilterSource] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>("updated")
  const [syncingId, setSyncingId] = useState<string | null>(null)

  const fetchTemplates = useCallback(() => {
    setIsLoading(true)
    fetch("/api/templates")
      .then((res) => res.json())
      .then((payload) => setTemplates(payload.data ?? []))
      .catch(() => setTemplates([]))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const categories = useMemo(() => extractCategories(templates), [templates])
  const frameworks = useMemo(() => extractFrameworks(templates), [templates])

  const filtered = useMemo(
    () => filterTemplates(templates, search, filterType, filterCategory, filterFramework, filterSource),
    [templates, search, filterType, filterCategory, filterFramework, filterSource]
  )

  const handleSync = useCallback(async (templateId: string) => {
    setSyncingId(templateId)
    try {
      await fetch(`/api/templates/${templateId}/sync`, { method: "POST" })
      // Refetch to get updated data
      fetchTemplates()
    } catch {
      // ignore
    } finally {
      setSyncingId(null)
    }
  }, [fetchTemplates])

  return {
    templates,
    filtered,
    categories,
    frameworks,
    isLoading,
    search,
    setSearch,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    filterFramework,
    setFilterFramework,
    filterSource,
    setFilterSource,
    sort,
    setSort,
    handleSync,
    syncingId,
    refetch: fetchTemplates,
  }
}
