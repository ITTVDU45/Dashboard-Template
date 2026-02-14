import { prisma } from "@/lib/prisma"
import { assetSchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

export async function GET() {
  const assets = await prisma.asset.findMany({
    include: {
      project: {
        include: {
          company: true,
        },
      },
      job: true,
    },
    orderBy: { createdAt: "desc" },
  })
  return ok(assets)
}

export async function POST(request: Request) {
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = assetSchema.safeParse(body)
  if (!parsed.success) return fail("Invalid asset payload", 400, parsed.error.flatten())

  const asset = await prisma.asset.create({
    data: {
      ...parsed.data,
      projectId: parsed.data.projectId || null,
      jobId: parsed.data.jobId || null,
      publicUrl: parsed.data.publicUrl || null,
      meta: parsed.data.meta ? JSON.stringify(parsed.data.meta) : null
    }
  })

  await createAuditLog({ entityType: "Asset", entityId: asset.id, action: "create", payload: parsed.data })
  return ok(asset, { status: 201 })
}
