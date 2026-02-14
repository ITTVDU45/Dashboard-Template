import { prisma } from "@/lib/prisma"
import { fail, ok } from "@/lib/api-helpers"
import { createAuditLog } from "@/lib/audit"

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return fail("Missing query parameter: id", 400)

  const job = await prisma.job.findUnique({ where: { id } })
  if (!job) return fail("Job not found", 404)

  const report = {
    summary: "Workflow simulation completed successfully",
    generatedAt: new Date().toISOString(),
    result: "done"
  }

  const updatedJob = await prisma.job.update({
    where: { id },
    data: {
      status: "done",
      startedAt: job.startedAt ?? new Date(),
      completedAt: new Date(),
      logs: [job.logs ?? "", "Worker stub executed and marked as done."].join("\n"),
      outputJson: JSON.stringify(report),
      previewUrl: job.previewUrl || `https://preview.local/jobs/${id}`,
      steps: JSON.stringify([
        { name: "Validate", state: "done" },
        { name: "Content", state: "done" },
        { name: "Visuals", state: "done" },
        { name: "Code", state: "done" },
        { name: "Upload", state: "done" },
        { name: "Report", state: "done" }
      ])
    }
  })

  await createAuditLog({
    entityType: "Job",
    entityId: id,
    action: "update",
    payload: { run: true }
  })

  return ok(updatedJob)
}
