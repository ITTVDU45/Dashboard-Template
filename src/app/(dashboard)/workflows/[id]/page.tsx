import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { parseJsonObject } from "@/lib/serializers"
import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimelineSteps } from "@/components/common/timeline-steps"
import { JsonViewer } from "@/components/common/json-viewer"
import { StatusBadge } from "@/components/common/status-badge"

const defaultSteps = [
  { key: "validate", label: "Validierung", state: "pending" as const },
  { key: "content", label: "Inhalt", state: "pending" as const },
  { key: "visuals", label: "Visuals", state: "pending" as const },
  { key: "code", label: "Code", state: "pending" as const },
  { key: "upload", label: "Upload", state: "pending" as const },
  { key: "report", label: "Bericht", state: "pending" as const }
]

export default async function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await prisma.job.findUnique({
    where: { id },
    include: { project: true, assets: true }
  })
  if (!job) notFound()

  const steps = parseJsonObject(job.steps, defaultSteps)

  return (
    <div className="space-y-6">
      <PageHeader title={`Job ${job.id}`} description="Timeline, Logs, Ein-/Ausgabe-JSON und Vorschau-URL" />
      <div className="flex items-center gap-3">
        <StatusBadge status={job.status as "queued" | "running" | "needs_review" | "done" | "failed"} />
        <span className="text-sm text-muted-foreground">Projekt: {job.project.name}</span>
      </div>
      <Card>
        <CardHeader><CardTitle>Timeline / Schritte</CardTitle></CardHeader>
        <CardContent>
          <TimelineSteps steps={steps} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Logs</CardTitle></CardHeader>
        <CardContent>
          <textarea
            className="min-h-40 w-full rounded-md border bg-muted/30 p-3 text-xs"
            readOnly
            value={job.logs || "Keine Logs vorhanden."}
          />
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Eingabe-JSON</CardTitle></CardHeader>
          <CardContent><JsonViewer value={parseJsonObject(job.inputJson, {})} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Ausgabe-JSON</CardTitle></CardHeader>
          <CardContent><JsonViewer value={parseJsonObject(job.outputJson, {})} /></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Vorschau-URL</CardTitle></CardHeader>
        <CardContent className="text-sm">{job.previewUrl || "-"}</CardContent>
      </Card>
    </div>
  )
}
