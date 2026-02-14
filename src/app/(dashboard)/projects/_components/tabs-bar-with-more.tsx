"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export const PROJECT_TAB_VALUES = [
  "overview",
  "activities",
  "todos",
  "finances",
  "jobs",
  "assets",
  "designs",
  "templates",
  "milestones",
  "settings",
] as const

export type ProjectTabValue = (typeof PROJECT_TAB_VALUES)[number]

const ALL_TABS: { value: ProjectTabValue; label: string }[] = [
  { value: "overview", label: "Übersicht" },
  { value: "activities", label: "Aktivitäten" },
  { value: "todos", label: "To-dos" },
  { value: "finances", label: "Finanzen" },
  { value: "jobs", label: "Jobs" },
  { value: "assets", label: "Assets" },
  { value: "designs", label: "Designs" },
  { value: "templates", label: "Templates" },
  { value: "milestones", label: "Meilensteine" },
  { value: "settings", label: "Einstellungen" },
]

interface TabsBarWithMoreProps {
  value: ProjectTabValue
  onValueChange: (value: ProjectTabValue) => void
  children: React.ReactNode
  className?: string
}

export function TabsBarWithMore({ value, onValueChange, children, className }: TabsBarWithMoreProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as ProjectTabValue)} className={cn("space-y-4", className)}>
      <TabsList className="flex h-10 flex-wrap gap-1 rounded-xl bg-muted/50 p-1">
        {ALL_TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="rounded-lg px-3 py-1.5 text-sm">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  )
}
