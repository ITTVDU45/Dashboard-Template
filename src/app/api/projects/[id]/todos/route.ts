import { todoSchema } from "@/lib/validations"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

function toTodoData(body: unknown) {
  const parsed = todoSchema.safeParse(body)
  if (!parsed.success) return null
  const d = parsed.data
  return {
    title: d.title,
    description: d.description ?? null,
    status: d.status,
    priority: d.priority,
    dueAt: d.dueAt ? new Date(d.dueAt) : null,
    assignedTo: d.assignedTo ?? null,
    milestoneId: d.milestoneId ?? null,
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } })
  if (!project) return fail("Project not found", 404)

  const todos = await prisma.todo.findMany({
    where: { projectId },
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
    include: { milestone: { select: { id: true, title: true } } },
  })
  return ok(todos)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } })
  if (!project) return fail("Project not found", 404)

  const body = await parseBody(request).catch(() => null)
  const data = toTodoData(body)
  if (!data) return fail("Invalid todo payload", 400)

  const todo = await prisma.todo.create({
    data: { projectId, ...data },
    include: { milestone: { select: { id: true, title: true } } },
  })
  await createAuditLog({
    entityType: "Todo",
    entityId: todo.id,
    action: "create",
    payload: { title: todo.title },
    projectId,
    summary: `To-do erstellt: ${todo.title}`,
  })
  return ok(todo, { status: 201 })
}
