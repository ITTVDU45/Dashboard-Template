import { prisma } from "@/lib/prisma"
import { fail, ok, parseBody } from "@/lib/api-helpers"
import { createAuditLog } from "@/lib/audit"
import { jobStatusSchema } from "@/lib/validations"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await prisma.job.findUnique({
    where: { id },
    include: { project: true, assets: true }
  })
  if (!job) return fail("Job not found", 404)
  return ok(job)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await parseBody<{
    status?: string
    logs?: string
    inputJson?: unknown
    outputJson?: unknown
    previewUrl?: string
  }>(request).catch(() => null)
  if (!body) return fail("Invalid payload", 400)

  let status: "queued" | "running" | "needs_review" | "done" | "failed" | undefined
  if (body.status !== undefined) {
    const parsedStatus = jobStatusSchema.safeParse(body.status)
    if (!parsedStatus.success) return fail("Invalid job status", 400, parsedStatus.error.flatten())
    status = parsedStatus.data
  }

  const job = await prisma.job.update({
    where: { id },
    data: {
      status,
      logs: body.logs ?? undefined,
      inputJson: body.inputJson !== undefined ? JSON.stringify(body.inputJson) : undefined,
      outputJson: body.outputJson !== undefined ? JSON.stringify(body.outputJson) : undefined,
      previewUrl: body.previewUrl ?? undefined
    }
  })

  await createAuditLog({ entityType: "Job", entityId: id, action: "update", payload: body })
  return ok(job)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.job.delete({ where: { id } })
  await createAuditLog({ entityType: "Job", entityId: id, action: "delete" })
  return ok({ deleted: true })
}
