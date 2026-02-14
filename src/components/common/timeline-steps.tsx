import { CheckCircle2, CircleDotDashed, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimelineStep {
  key: string
  label: string
  state: "pending" | "running" | "done"
}

export function TimelineSteps({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step) => (
        <li
          key={step.key}
          className={cn(
            "flex items-center gap-3 rounded-lg border p-3",
            step.state === "done" && "border-emerald-500/30 bg-emerald-500/5",
            step.state === "running" && "border-blue-500/30 bg-blue-500/5"
          )}
        >
          {step.state === "done" ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : null}
          {step.state === "running" ? <Loader2 className="h-4 w-4 animate-spin text-blue-400" /> : null}
          {step.state === "pending" ? <CircleDotDashed className="h-4 w-4 text-muted-foreground" /> : null}
          <span className="text-sm">{step.label}</span>
        </li>
      ))}
    </ol>
  )
}
