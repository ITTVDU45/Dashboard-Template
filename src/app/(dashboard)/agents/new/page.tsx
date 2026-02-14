import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { AgentForm } from "../_components/agent-form"

export default function NewAgentPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Neuer Agent" description="Agent-Typ, Modell-Hinweis und JSON-Konfiguration festlegen." />
      <Card>
        <CardContent className="pt-6">
          <AgentForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
