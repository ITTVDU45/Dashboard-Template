"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { AgentData } from "../_lib/types"
import { extractCategories, filterAgents } from "../_lib/helpers"

interface UseAgentsReturn {
  /** Alle Agenten (ungefiltert) */
  agents: AgentData[]
  /** Gefilterte Agenten */
  filtered: AgentData[]
  /** Alle verfügbaren Kategorien */
  categories: string[]
  /** Ladezustand */
  isLoading: boolean
  /** Aktueller Suchbegriff */
  query: string
  /** Suchbegriff setzen */
  setQuery: (value: string) => void
  /** Aktive Kategorie (null = alle) */
  filterCategory: string | null
  /** Kategorie-Filter setzen/togeln */
  setFilterCategory: (value: string | null) => void
  /** ID des gerade laufenden Agents (null = keiner) */
  runningId: string | null
  /** Manuellen Run starten (MVP-Simulation) */
  handleManualRun: (agentId: string, agentName: string) => Promise<void>
}

export function useAgents(): UseAgentsReturn {
  const [agents, setAgents] = useState<AgentData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [runningId, setRunningId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((payload) => setAgents(payload.data ?? []))
      .finally(() => setIsLoading(false))
  }, [])

  const categories = useMemo(() => extractCategories(agents), [agents])
  const filtered = useMemo(() => filterAgents(agents, query, filterCategory), [agents, query, filterCategory])

  const handleManualRun = useCallback(async (agentId: string, agentName: string) => {
    setRunningId(agentId)
    // MVP: Simuliert einen Run – später echte Ausführung
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRunningId(null)
    alert(`Agent „${agentName}" wurde simuliert ausgeführt.\n(MVP – echte Ausführung kommt später)`)
  }, [])

  return {
    agents,
    filtered,
    categories,
    isLoading,
    query,
    setQuery,
    filterCategory,
    setFilterCategory,
    runningId,
    handleManualRun,
  }
}
