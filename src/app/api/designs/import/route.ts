import { prisma } from "@/lib/prisma"
import { importJobSchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

export async function POST(request: Request) {
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = importJobSchema.safeParse(body)
  if (!parsed.success) return fail("Ungültige Import-Job-Daten", 400, parsed.error.flatten())

  const data = parsed.data

  const job = await prisma.importJob.create({
    data: {
      type: data.type,
      inputData: JSON.stringify(data.inputData),
      status: "queued",
    },
  })

  await createAuditLog({
    entityType: "ImportJob",
    entityId: job.id,
    action: "create",
    payload: data,
  })

  return ok(job, { status: 201 })
}
