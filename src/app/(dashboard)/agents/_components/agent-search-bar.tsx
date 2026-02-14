"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface AgentSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function AgentSearchBar({ value, onChange }: AgentSearchBarProps) {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Agenten durchsuchen..."
        className="pl-9"
      />
    </div>
  )
}
