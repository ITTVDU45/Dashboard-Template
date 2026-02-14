import { AGENT_ICON_MAP, AGENT_ICON_FALLBACK } from "./constants"
import type { AgentData, AgentIconResult, ParsedConfig } from "./types"

/** JSON-Config-String sicher parsen */
export function parseConfig(raw: string | null): ParsedConfig {
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

/** Icon + Gradient anhand des Agent-Namens ermitteln */
export function getAgentIcon(name: string): AgentIconResult {
  const lower = name.toLowerCase()
  for (const entry of AGENT_ICON_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return { icon: entry.icon, gradient: entry.gradient }
    }
  }
  return AGENT_ICON_FALLBACK
}

/** Alle einzigartigen Kategorien aus einer Agent-Liste extrahieren */
export function extractCategories(agents: AgentData[]): string[] {
  const set = new Set<string>()
  for (const agent of agents) {
    const cfg = parseConfig(agent.config)
    if (cfg.kategorie) set.add(cfg.kategorie)
  }
  return Array.from(set).sort()
}

/** Agents nach Suche + Kategorie filtern */
export function filterAgents(
  agents: AgentData[],
  query: string,
  category: string | null
): AgentData[] {
  return agents.filter((agent) => {
    const cfg = parseConfig(agent.config)
    if (category && cfg.kategorie !== category) return false
    if (!query.trim()) return true
    const searchText = `${agent.name} ${agent.type} ${agent.modelHint || ""} ${cfg.beschreibung || ""} ${cfg.kategorie || ""}`.toLowerCase()
    return searchText.includes(query.trim().toLowerCase())
  })
}
