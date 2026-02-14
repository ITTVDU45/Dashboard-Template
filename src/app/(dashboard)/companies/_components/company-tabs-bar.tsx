"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export const COMPANY_TAB_VALUES = [
  "overview",
  "services",
  "onlinePresence",
  "projects",
  "jobs",
  "settings",
] as const

export type CompanyTabValue = (typeof COMPANY_TAB_VALUES)[number]

const TABS: { value: CompanyTabValue; label: string }[] = [
  { value: "overview", label: "Ubersicht" },
  { value: "services", label: "Leistungen" },
  { value: "onlinePresence", label: "Online-Prasenz" },
  { value: "projects", label: "Projekte" },
  { value: "jobs", label: "Jobs" },
  { value: "settings", label: "Einstellungen" },
]

interface CompanyTabsBarProps {
  value: CompanyTabValue
  onValueChange: (value: CompanyTabValue) => void
  children: React.ReactNode
  className?: string
}

export function CompanyTabsBar({ value, onValueChange, children, className }: CompanyTabsBarProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as CompanyTabValue)} className={cn("space-y-4", className)}>
      <TabsList className="flex h-10 flex-wrap gap-1 rounded-xl bg-muted/50 p-1">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="rounded-lg px-3 py-1.5 text-sm">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  )
}
