import { milestoneSchema } from "@/lib/validations"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

function toMilestoneUpdate(body: unknown) {
  const parsed = milestoneSchema.partial().safeParse(body)
  if (!parsed.success) return null
  const d = parsed.data
  return {
    ...(d.title !== undefined && { title: d.title }),
    ...(d.description !== undefined && { description: d.description ?? null }),
    ...(d.status !== undefined && { status: d.status }),
    ...(d.dueAt !== undefined && { dueAt: d.dueAt ? new Date(d.dueAt) : null }),
    ...(d.sortOrder !== undefined && { sortOrder: d.sortOrder }),
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const milestone = await prisma.milestone.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, name: true } },
      _count: { select: { todos: true } },
    },
  })
  if (!milestone) return fail("Milestone not found", 404)
  return ok(milestone)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = await prisma.milestone.findUnique({ where: { id }, select: { id: true, projectId: true, title: true } })
  if (!existing) return fail("Milestone not found", 404)

  const body = await parseBody(request).catch(() => null)
  const data = toMilestoneUpdate(body)
  if (!data || Object.keys(data).length === 0) return fail("No valid fields to update", 400)

  const milestone = await prisma.milestone.update({
    where: { id },
    data,
  })
  await createAuditLog({
    entityType: "Milestone",
    entityId: id,
    action: "update",
    payload: data,
    projectId: existing.projectId,
    summary: `Meilenstein aktualisiert: ${milestone.title}`,
  })
  return ok(milestone)
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = await prisma.milestone.findUnique({ where: { id }, select: { id: true, projectId: true, title: true } })
  if (!existing) return fail("Milestone not found", 404)

  await prisma.milestone.delete({ where: { id } })
  await createAuditLog({
    entityType: "Milestone",
    entityId: id,
    action: "delete",
    payload: { title: existing.title },
    projectId: existing.projectId,
    summary: `Meilenstein gelöscht: ${existing.title}`,
  })
  return ok({ deleted: id })
}
