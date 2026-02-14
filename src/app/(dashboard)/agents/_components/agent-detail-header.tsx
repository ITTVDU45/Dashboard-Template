import { Badge } from "@/components/ui/badge"
import { TYPE_LABELS } from "../_lib/constants"

interface AgentDetailHeaderProps {
  type: string
  modelHint: string | null
  enabled: boolean
  kategorie: string | null
}

export function AgentDetailHeader({ type, modelHint, enabled, kategorie }: AgentDetailHeaderProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant={enabled ? "success" : "secondary"}>
        {enabled ? "Aktiv" : "Inaktiv"}
      </Badge>
      <Badge variant="outline">{TYPE_LABELS[type] || type}</Badge>
      {modelHint ? <Badge variant="purple">{modelHint}</Badge> : null}
      {kategorie ? <Badge variant="default">{kategorie}</Badge> : null}
    </div>
  )
}
