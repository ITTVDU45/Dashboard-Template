"use client"

import Link from "next/link"
import { Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CATEGORY_COLORS, TYPE_LABELS } from "../_lib/constants"
import { getAgentIcon, parseConfig } from "../_lib/helpers"
import type { AgentData } from "../_lib/types"
import { AgentRunButton } from "./agent-run-button"

interface AgentCardProps {
  agent: AgentData
  index: number
  isRunning: boolean
  onRun: (agentId: string, agentName: string) => void
}

export function AgentCard({ agent, index, isRunning, onRun }: AgentCardProps) {
  const { icon: Icon, gradient } = getAgentIcon(agent.name)
  const cfg = parseConfig(agent.config)

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in motion-reduce:animate-none"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Status-Badge oben rechts */}
      <div className="absolute right-3 top-3 z-10">
        <Badge
          variant={agent.enabled ? "success" : "secondary"}
          className="text-[10px] uppercase tracking-wider"
        >
          {agent.enabled ? "Aktiv" : "Inaktiv"}
        </Badge>
      </div>

      {/* Header: Icon + Name + Meta */}
      <div className="flex items-start gap-3 p-4 pb-0">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0 flex-1 pr-14">
          <h3 className="truncate text-sm font-semibold text-foreground leading-tight">
            {agent.name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {TYPE_LABELS[agent.type] || agent.type}
            </span>
            {agent.modelHint ? (
              <span className="truncate text-[10px] text-muted-foreground">
                {agent.modelHint}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Beschreibung */}
      <div className="flex-1 px-4 py-3">
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {cfg.beschreibung || "Keine Beschreibung vorhanden."}
        </p>
      </div>

      {/* Kategorie-Tag */}
      {cfg.kategorie ? (
        <div className="px-4 pb-2">
          <span
            className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-medium ${
              CATEGORY_COLORS[cfg.kategorie] || "bg-muted text-muted-foreground border-border"
            }`}
          >
            {cfg.kategorie}
          </span>
        </div>
      ) : null}

      {/* Footer: Aktionen */}
      <div className="flex items-center gap-2 border-t border-border px-4 py-3">
        <AgentRunButton
          isRunning={isRunning}
          isDisabled={!agent.enabled}
          onClick={() => onRun(agent.id, agent.name)}
        />
        <Button
          size="sm"
          variant="ghost"
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href={`/agents/${agent.id}`}>
            <Eye className="h-3 w-3" />
            Details
          </Link>
        </Button>
      </div>
    </div>
  )
}
