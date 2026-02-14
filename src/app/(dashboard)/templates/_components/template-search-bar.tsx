"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface TemplateSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function TemplateSearchBar({ value, onChange }: TemplateSearchBarProps) {
  return (
    <div className="relative max-w-md flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Templates durchsuchen..."
        className="pl-9"
      />
    </div>
  )
}
