import { prisma } from "@/lib/prisma"
import { fail, ok, parseBody } from "@/lib/api-helpers"
import { createAuditLog } from "@/lib/audit"
import { jobStatusSchema } from "@/lib/validations"

export async function GET() {
  const jobs = await prisma.job.findMany({
    include: { project: true },
    orderBy: { createdAt: "desc" }
  })
  return ok(jobs)
}

export async function POST(request: Request) {
  const body = await parseBody<{
    projectId?: string
    templateId?: string
    designId?: string
    status?: string
    inputJson?: unknown
    previewUrl?: string
  }>(request).catch(() => null)

  if (!body?.projectId) return fail("projectId is required", 400)
  const status = jobStatusSchema.safeParse(body.status ?? "queued")
  if (!status.success) return fail("Invalid job status", 400, status.error.flatten())

  const job = await prisma.job.create({
    data: {
      projectId: body.projectId,
      templateId: body.templateId || null,
      designId: body.designId || null,
      status: status.data,
      inputJson: body.inputJson ? JSON.stringify(body.inputJson) : null,
      previewUrl: body.previewUrl || null
    }
  })

  await createAuditLog({ entityType: "Job", entityId: job.id, action: "create", payload: body })
  return ok(job, { status: 201 })
}
