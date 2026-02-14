"use client"

import { Search, Layout, Component, Layers } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { SECTION_CATEGORIES } from "../_lib/constants"

interface TemplateCategorySidebarProps {
  activeCategory: string | null
  onSelectCategory: (category: string | null) => void
  search: string
  onSearchChange: (value: string) => void
}

interface CategoryItem {
  id: string | null
  label: string
  icon: React.ComponentType<{ className?: string }>
  type: "top" | "section"
}

export function TemplateCategorySidebar({
  activeCategory,
  onSelectCategory,
  search,
  onSearchChange,
}: TemplateCategorySidebarProps) {
  // Top-Level Kategorien
  const topCategories: CategoryItem[] = [
    { id: null, label: "Alle Templates", icon: Layout, type: "top" },
    { id: "_project", label: "Projekte", icon: Layout, type: "top" },
    { id: "_component", label: "Komponenten", icon: Component, type: "top" },
    { id: "_section", label: "Sections", icon: Layers, type: "top" },
  ]

  // Section Kategorien (hero, header, pricing, etc.)
  const sectionCategories: CategoryItem[] = SECTION_CATEGORIES.map((cat) => ({
    id: cat.value,
    label: cat.label,
    icon: cat.icon,
    type: "section" as const,
  }))

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r bg-surface/30">
      {/* Header mit Suchfeld */}
      <div className="shrink-0 border-b p-4 pb-3">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Kategorien
        </h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Suchen..."
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      {/* Kategorie-Liste */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Top-Level Kategorien */}
        <div className="mb-2 space-y-0.5">
          {topCategories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id || "all"}
                onClick={() => onSelectCategory(cat.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all",
                  "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  isActive
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground/60"
                  )}
                />
                <span className="truncate">{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div className="my-3 border-t" />

        {/* Section Kategorien */}
        <div className="space-y-0.5">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            Section-Typen
          </p>
          {sectionCategories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-sm transition-all",
                  "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  isActive
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground/60"
                  )}
                />
                <span className="truncate text-xs">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
