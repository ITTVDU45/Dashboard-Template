import { prisma } from "@/lib/prisma"
import { fail, ok, parseBody } from "@/lib/api-helpers"
import { createAuditLog } from "@/lib/audit"
import { jobStartSchema } from "@/lib/validations"

export async function POST(request: Request) {
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = jobStartSchema.safeParse(body)
  if (!parsed.success) return fail("Invalid job start payload", 400, parsed.error.flatten())

  const job = await prisma.job.create({
    data: {
      projectId: parsed.data.projectId,
      templateId: parsed.data.templateId ?? null,
      designId: parsed.data.designId ?? null,
      status: "queued",
      inputJson: JSON.stringify(parsed.data.contentFields),
      scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null,
      steps: JSON.stringify([
        { name: "Validate", state: "done" },
        { name: "Content", state: "pending" },
        { name: "Visuals", state: "pending" },
        { name: "Code", state: "pending" },
        { name: "Upload", state: "pending" },
        { name: "Report", state: "pending" }
      ])
    }
  })

  await createAuditLog({
    entityType: "Job",
    entityId: job.id,
    action: "create",
    payload: parsed.data
  })

  return ok(job, { status: 201 })
}
