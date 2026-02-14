"use client"

import { Search, X, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { DesignFilters, DesignSortKey } from "../_lib/types"
import {
  CATEGORY_LABELS,
  INDUSTRY_LABELS,
  SOURCE_LABELS,
  STATUS_LABELS,
  SORT_OPTIONS,
} from "../_lib/constants"

interface DesignFiltersBarProps {
  filters: DesignFilters
  sort: DesignSortKey
  onFilterChange: (key: keyof DesignFilters, value: string) => void
  onSortChange: (sort: DesignSortKey) => void
  onReset: () => void
  hasActiveFilters: boolean
  totalCount: number
  filteredCount: number
}

export function DesignFiltersBar({
  filters,
  sort,
  onFilterChange,
  onSortChange,
  onReset,
  hasActiveFilters,
  totalCount,
  filteredCount,
}: DesignFiltersBarProps) {
  return (
    <div className="space-y-3">
      {/* Top Row: Search + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Designs durchsuchen..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pl-9"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={(v) => onSortChange(v as DesignSortKey)}>
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
              <SelectValue placeholder="Sortierung" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category Filter */}
        <Select
          value={filters.category || "all"}
          onValueChange={(v) => onFilterChange("category", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs">
            <SelectValue placeholder="Kategorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Kategorien</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Industry Filter */}
        <Select
          value={filters.industry || "all"}
          onValueChange={(v) => onFilterChange("industry", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs">
            <SelectValue placeholder="Branche" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Branchen</SelectItem>
            {Object.entries(INDUSTRY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Source Filter */}
        <Select
          value={filters.sourceType || "all"}
          onValueChange={(v) => onFilterChange("sourceType", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-8 w-auto min-w-[100px] text-xs">
            <SelectValue placeholder="Quelle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Quellen</SelectItem>
            {Object.entries(SOURCE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={(v) => onFilterChange("status", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset + Count */}
        <div className="flex items-center gap-2 ml-auto">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onReset}>
              <X className="mr-1 h-3 w-3" />
              Filter zurücksetzen
            </Button>
          )}
          <Badge variant="secondary" className="text-xs">
            {filteredCount === totalCount
              ? `${totalCount} Designs`
              : `${filteredCount} / ${totalCount} Designs`}
          </Badge>
        </div>
      </div>
    </div>
  )
}
