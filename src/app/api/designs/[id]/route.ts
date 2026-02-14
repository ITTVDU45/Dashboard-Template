import { prisma } from "@/lib/prisma"
import { designSchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const design = await prisma.design.findUnique({ where: { id } })
  if (!design) return fail("Design nicht gefunden", 404)
  return ok(design)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = designSchema.safeParse(body)
  if (!parsed.success) return fail("Ungültige Design-Daten", 400, parsed.error.flatten())

  const data = parsed.data

  const design = await prisma.design.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description || null,
      sourceType: data.sourceType,
      sourceUrl: data.sourceUrl || null,
      dribbbleId: data.dribbbleId || null,
      dribbbleUser: data.dribbbleUser || null,
      category: data.category || null,
      industry: data.industry || null,
      images: data.images ? JSON.stringify(data.images) : null,
      coverImageUrl: data.coverImageUrl || null,
      screenshotUrl: data.screenshotUrl || null,
      status: data.status,
      tags: JSON.stringify(data.tags),
      notes: data.notes || null,
      collectionIds: data.collectionIds.length > 0 ? JSON.stringify(data.collectionIds) : null,
    },
  })

  await createAuditLog({ entityType: "Design", entityId: id, action: "update", payload: data })
  return ok(design)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await parseBody<Record<string, unknown>>(request).catch(() => null)
  if (!body) return fail("Ungültiger JSON-Body", 400)

  // Build partial update
  const updateData: Record<string, unknown> = {}

  if ("tags" in body && Array.isArray(body.tags)) {
    updateData.tags = JSON.stringify(body.tags)
  }
  if ("status" in body && typeof body.status === "string") {
    updateData.status = body.status
  }
  if ("collectionIds" in body && Array.isArray(body.collectionIds)) {
    updateData.collectionIds = JSON.stringify(body.collectionIds)
  }
  if ("notes" in body && typeof body.notes === "string") {
    updateData.notes = body.notes
  }
  if ("category" in body) {
    updateData.category = body.category as string | null
  }
  if ("industry" in body) {
    updateData.industry = body.industry as string | null
  }

  if (Object.keys(updateData).length === 0) return fail("Keine Felder zum Aktualisieren", 400)

  const design = await prisma.design.update({ where: { id }, data: updateData })
  await createAuditLog({ entityType: "Design", entityId: id, action: "update", payload: body })
  return ok(design)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.design.delete({ where: { id } })
  await createAuditLog({ entityType: "Design", entityId: id, action: "delete" })
  return ok({ deleted: true })
}
