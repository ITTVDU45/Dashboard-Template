"use client"

import { PageHeader } from "@/components/common/page-header"
import { useAgents } from "./_hooks/use-agents"
import { AgentSearchBar } from "./_components/agent-search-bar"
import { AgentCategoryFilter } from "./_components/agent-category-filter"
import { AgentCardGrid } from "./_components/agent-card-grid"

export default function AgentsPage() {
  const {
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
  } = useAgents()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenten"
        description="KI-Agenten konfigurieren und manuell ausführen. Echte Ausführung kommt später über OpenClaw/n8n."
        ctaLabel="Agent hinzufügen"
        ctaHref="/agents/new"
      />

      {/* Suche + Kategorie-Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AgentSearchBar value={query} onChange={setQuery} />
        <AgentCategoryFilter
          categories={categories}
          activeCategory={filterCategory}
          onSelect={setFilterCategory}
        />
      </div>

      {/* Card-Grid */}
      <AgentCardGrid
        agents={filtered}
        totalCount={agents.length}
        isLoading={isLoading}
        hasQuery={query.trim().length > 0}
        runningId={runningId}
        onRun={handleManualRun}
      />
    </div>
  )
}
