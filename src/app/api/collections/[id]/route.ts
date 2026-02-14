import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const collection = await prisma.collection.findUnique({ where: { id } })
  if (!collection) return fail("Collection nicht gefunden", 404)
  return ok(collection)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await parseBody<Record<string, unknown>>(request).catch(() => null)
  if (!body) return fail("Ungültiger JSON-Body", 400)

  const updateData: Record<string, unknown> = {}
  if ("name" in body && typeof body.name === "string") updateData.name = body.name
  if ("description" in body) updateData.description = body.description as string | null
  if ("designIds" in body && Array.isArray(body.designIds)) {
    updateData.designIds = JSON.stringify(body.designIds)
  }

  if (Object.keys(updateData).length === 0) return fail("Keine Felder zum Aktualisieren", 400)

  const collection = await prisma.collection.update({ where: { id }, data: updateData })
  await createAuditLog({ entityType: "Collection", entityId: id, action: "update", payload: body })
  return ok(collection)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.collection.delete({ where: { id } })
  await createAuditLog({ entityType: "Collection", entityId: id, action: "delete" })
  return ok({ deleted: true })
}
