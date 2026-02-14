import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { AgentForm } from "../../_components/agent-form"

export default async function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const agent = await prisma.agent.findUnique({ where: { id } })
  if (!agent) notFound()

  return (
    <div className="space-y-6">
      <PageHeader title={`Agent bearbeiten: ${agent.name}`} description="Typ, Modell und Konfiguration ändern." />
      <Card>
        <CardContent className="pt-6">
          <AgentForm
            mode="edit"
            agentId={agent.id}
            initialValues={{
              name: agent.name,
              type: agent.type as "content" | "design" | "code" | "qc",
              modelHint: agent.modelHint || "",
              enabled: agent.enabled,
              config: agent.config || "{}"
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
