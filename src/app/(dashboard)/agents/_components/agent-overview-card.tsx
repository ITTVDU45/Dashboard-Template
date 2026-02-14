import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TYPE_LABELS } from "../_lib/constants"

interface AgentOverviewCardProps {
  type: string
  modelHint: string | null
  enabled: boolean
  kategorie: string | null
  beschreibung: string | null
}

export function AgentOverviewCard({
  type,
  modelHint,
  enabled,
  kategorie,
  beschreibung,
}: AgentOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Übersicht</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-xs text-muted-foreground">Typ</p>
          <p className="text-sm font-medium">{TYPE_LABELS[type] || type}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Modell-Hinweis</p>
          <p className="text-sm font-medium">{modelHint || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Status</p>
          <p className="text-sm font-medium">{enabled ? "Aktiv" : "Inaktiv"}</p>
        </div>
        {kategorie ? (
          <div>
            <p className="text-xs text-muted-foreground">Kategorie</p>
            <p className="text-sm font-medium">{kategorie}</p>
          </div>
        ) : null}
        {beschreibung ? (
          <div className="md:col-span-2">
            <p className="text-xs text-muted-foreground">Beschreibung</p>
            <p className="text-sm">{beschreibung}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
