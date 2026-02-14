import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "queued" | "running" | "needs_review" | "done" | "failed"
}

const statusLabelMap: Record<StatusBadgeProps["status"], string> = {
  queued: "Warteschlange",
  running: "Läuft",
  needs_review: "Prüfung nötig",
  done: "Fertig",
  failed: "Fehlgeschlagen"
}

const statusClassMap: Record<StatusBadgeProps["status"], string> = {
  queued: "bg-secondary text-secondary-foreground",
  running: "bg-blue-500/15 text-blue-400",
  needs_review: "bg-amber-500/15 text-amber-400",
  done: "bg-emerald-500/15 text-emerald-400",
  failed: "bg-red-500/15 text-red-400"
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={cn("font-medium", statusClassMap[status])}>
      {statusLabelMap[status]}
    </Badge>
  )
}
