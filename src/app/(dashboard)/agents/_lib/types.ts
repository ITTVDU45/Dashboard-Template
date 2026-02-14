import type { LucideIcon } from "lucide-react"

/** Rohes Agent-Objekt wie es von der API kommt */
export interface AgentData {
  id: string
  name: string
  type: string
  modelHint: string | null
  enabled: boolean
  config: string | null
}

/** Geparste Config aus dem JSON-String */
export interface ParsedConfig {
  beschreibung?: string
  kategorie?: string
  [key: string]: unknown
}

/** Ein Eintrag im Icon-Mapping */
export interface AgentIconEntry {
  keywords: string[]
  icon: LucideIcon
  gradient: string
}

/** Ergebnis von getAgentIcon() */
export interface AgentIconResult {
  icon: LucideIcon
  gradient: string
}
