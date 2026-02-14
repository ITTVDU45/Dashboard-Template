import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { parseJsonObject } from "@/lib/serializers"
import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { JsonViewer } from "@/components/common/json-viewer"
import { AgentDetailHeader } from "../_components/agent-detail-header"
import { AgentOverviewCard } from "../_components/agent-overview-card"

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const agent = await prisma.agent.findUnique({ where: { id } })
  if (!agent) notFound()

  const config = parseJsonObject(agent.config, {}) as Record<string, unknown>
  const beschreibung = typeof config.beschreibung === "string" ? config.beschreibung : null
  const kategorie = typeof config.kategorie === "string" ? config.kategorie : null

  return (
    <div className="space-y-6">
      <PageHeader
        title={agent.name}
        description={beschreibung || "Agent-Konfiguration (MVP, keine echte Ausführung)."}
        ctaLabel="Bearbeiten"
        ctaHref={`/agents/${agent.id}/edit`}
      />

      <AgentDetailHeader
        type={agent.type}
        modelHint={agent.modelHint}
        enabled={agent.enabled}
        kategorie={kategorie}
      />

      <AgentOverviewCard
        type={agent.type}
        modelHint={agent.modelHint}
        enabled={agent.enabled}
        kategorie={kategorie}
        beschreibung={beschreibung}
      />

      <Card>
        <CardHeader>
          <CardTitle>Konfiguration (JSON)</CardTitle>
        </CardHeader>
        <CardContent>
          <JsonViewer value={config} />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href={`/agents/${agent.id}/edit`}>Bearbeiten</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/agents">Zurück zur Übersicht</Link>
        </Button>
      </div>
    </div>
  )
}
