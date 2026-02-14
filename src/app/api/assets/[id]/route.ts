import { prisma } from "@/lib/prisma"
import { assetSchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const asset = await prisma.asset.findUnique({ where: { id }, include: { project: true, job: true } })
  if (!asset) return fail("Asset not found", 404)
  return ok(asset)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const existing = await prisma.asset.findUnique({ where: { id }, select: { projectId: true } })
  if (!existing) return fail("Asset not found", 404)
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = assetSchema.safeParse(body)
  if (!parsed.success) return fail("Invalid asset payload", 400, parsed.error.flatten())

  const asset = await prisma.asset.update({
    where: { id },
    data: {
      ...parsed.data,
      projectId: parsed.data.projectId || null,
      jobId: parsed.data.jobId || null,
      publicUrl: parsed.data.publicUrl || null,
      meta: parsed.data.meta ? JSON.stringify(parsed.data.meta) : null
    }
  })
  await createAuditLog({
    entityType: "Asset",
    entityId: id,
    action: "update",
    payload: parsed.data,
    projectId: existing.projectId ?? undefined,
    summary: `Asset aktualisiert: ${asset.type}`,
  })
  return ok(asset)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const existing = await prisma.asset.findUnique({ where: { id }, select: { projectId: true } })
  if (!existing) return fail("Asset not found", 404)
  await prisma.asset.delete({ where: { id } })
  await createAuditLog({
    entityType: "Asset",
    entityId: id,
    action: "delete",
    projectId: existing.projectId ?? undefined,
    summary: "Asset gelöscht",
  })
  return ok({ deleted: true })
}
