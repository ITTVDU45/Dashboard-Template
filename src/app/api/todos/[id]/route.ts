import { todoSchema } from "@/lib/validations"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

function toTodoUpdate(body: unknown) {
  const parsed = todoSchema.partial().safeParse(body)
  if (!parsed.success) return null
  const d = parsed.data
  return {
    ...(d.title !== undefined && { title: d.title }),
    ...(d.description !== undefined && { description: d.description ?? null }),
    ...(d.status !== undefined && { status: d.status }),
    ...(d.priority !== undefined && { priority: d.priority }),
    ...(d.dueAt !== undefined && { dueAt: d.dueAt ? new Date(d.dueAt) : null }),
    ...(d.assignedTo !== undefined && { assignedTo: d.assignedTo ?? null }),
    ...(d.milestoneId !== undefined && { milestoneId: d.milestoneId ?? null }),
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const todo = await prisma.todo.findUnique({
    where: { id },
    include: { milestone: { select: { id: true, title: true } }, project: { select: { id: true, name: true } } },
  })
  if (!todo) return fail("Todo not found", 404)
  return ok(todo)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = await prisma.todo.findUnique({ where: { id }, select: { id: true, projectId: true, title: true } })
  if (!existing) return fail("Todo not found", 404)

  const body = await parseBody(request).catch(() => null)
  const data = toTodoUpdate(body)
  if (!data || Object.keys(data).length === 0) return fail("No valid fields to update", 400)

  const todo = await prisma.todo.update({
    where: { id },
    data,
    include: { milestone: { select: { id: true, title: true } } },
  })
  await createAuditLog({
    entityType: "Todo",
    entityId: id,
    action: "update",
    payload: data,
    projectId: existing.projectId,
    summary: `To-do aktualisiert: ${todo.title}`,
  })
  return ok(todo)
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = await prisma.todo.findUnique({ where: { id }, select: { id: true, projectId: true, title: true } })
  if (!existing) return fail("Todo not found", 404)

  await prisma.todo.delete({ where: { id } })
  await createAuditLog({
    entityType: "Todo",
    entityId: id,
    action: "delete",
    payload: { title: existing.title },
    projectId: existing.projectId,
    summary: `To-do gelöscht: ${existing.title}`,
  })
  return ok({ deleted: id })
}
