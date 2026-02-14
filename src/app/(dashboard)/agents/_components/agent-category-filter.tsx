"use client"

import { cn } from "@/lib/utils"

interface AgentCategoryFilterProps {
  categories: string[]
  activeCategory: string | null
  onSelect: (category: string | null) => void
}

export function AgentCategoryFilter({ categories, activeCategory, onSelect }: AgentCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
          !activeCategory
            ? "border-primary bg-primary/10 text-primary"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
        )}
      >
        Alle
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(activeCategory === cat ? null : cat)}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
            activeCategory === cat
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
