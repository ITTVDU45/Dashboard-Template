"use client"

import { cn } from "@/lib/utils"
import {
  TYPE_LABELS,
  SOURCE_LABELS,
  FRAMEWORK_LABELS,
  CATEGORY_LABELS,
  SORT_OPTIONS,
} from "../_lib/constants"
import type { SortOption } from "../_lib/types"

interface TemplateFiltersProps {
  // Type filter
  filterType: string | null
  onTypeChange: (v: string | null) => void
  // Category filter
  categories: string[]
  filterCategory: string | null
  onCategoryChange: (v: string | null) => void
  // Framework filter
  frameworks: string[]
  filterFramework: string | null
  onFrameworkChange: (v: string | null) => void
  // Source filter
  filterSource: string | null
  onSourceChange: (v: string | null) => void
  // Sort
  sort: SortOption
  onSortChange: (v: SortOption) => void
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

export function TemplateFilters({
  filterType,
  onTypeChange,
  categories,
  filterCategory,
  onCategoryChange,
  frameworks,
  filterFramework,
  onFrameworkChange,
  filterSource,
  onSourceChange,
  sort,
  onSortChange,
}: TemplateFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Row 1: Type + Source + Sort */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Type chips */}
        <ChipButton active={!filterType} onClick={() => onTypeChange(null)}>
          Alle
        </ChipButton>
        {Object.entries(TYPE_LABELS).map(([value, label]) => (
          <ChipButton
            key={value}
            active={filterType === value}
            onClick={() => onTypeChange(filterType === value ? null : value)}
          >
            {label}
          </ChipButton>
        ))}

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-border" />

        {/* Source chips */}
        {Object.entries(SOURCE_LABELS).map(([value, label]) => (
          <ChipButton
            key={value}
            active={filterSource === value}
            onClick={() => onSourceChange(filterSource === value ? null : value)}
          >
            {label}
          </ChipButton>
        ))}

        {/* Sort dropdown (pushed right) */}
        <div className="ml-auto">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="h-8 rounded-lg border border-border bg-background px-2 text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Category + Framework (conditional) */}
      {(categories.length > 0 || frameworks.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Category chips */}
          {categories.length > 0 &&
            categories.map((cat) => (
              <ChipButton
                key={cat}
                active={filterCategory === cat}
                onClick={() => onCategoryChange(filterCategory === cat ? null : cat)}
              >
                {CATEGORY_LABELS[cat] || cat}
              </ChipButton>
            ))}

          {/* Framework chips */}
          {frameworks.length > 0 && categories.length > 0 && (
            <div className="mx-1 h-5 w-px bg-border" />
          )}
          {frameworks.length > 0 &&
            frameworks.map((fw) => (
              <ChipButton
                key={fw}
                active={filterFramework === fw}
                onClick={() => onFrameworkChange(filterFramework === fw ? null : fw)}
              >
                {FRAMEWORK_LABELS[fw] || fw}
              </ChipButton>
            ))}
        </div>
      )}
    </div>
  )
}
