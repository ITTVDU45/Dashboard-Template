"use client"

import { Bot } from "lucide-react"
import { EmptyState } from "@/components/common/empty-state"
import type { AgentData } from "../_lib/types"
import { AgentCard } from "./agent-card"

interface AgentCardGridProps {
  agents: AgentData[]
  totalCount: number
  isLoading: boolean
  hasQuery: boolean
  runningId: string | null
  onRun: (agentId: string, agentName: string) => void
}

function AgentCardSkeleton() {
  return <div className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
}

export function AgentCardGrid({
  agents,
  totalCount,
  isLoading,
  hasQuery,
  runningId,
  onRun,
}: AgentCardGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <AgentCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <EmptyState
        icon={Bot}
        title="Keine Agenten gefunden"
        description={
          hasQuery
            ? "Versuche einen anderen Suchbegriff."
            : "Lege deinen ersten KI-Agenten an."
        }
        action={!hasQuery ? { label: "Agent hinzufügen", href: "/agents/new" } : undefined}
      />
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {agents.map((agent, index) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            index={index}
            isRunning={runningId === agent.id}
            onRun={onRun}
          />
        ))}
      </div>

      {/* Zähler */}
      <p className="text-center text-xs text-muted-foreground">
        {agents.length} von {totalCount} Agenten angezeigt
      </p>
    </>
  )
}
