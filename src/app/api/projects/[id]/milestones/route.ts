import { milestoneSchema } from "@/lib/validations"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

function toMilestoneData(body: unknown) {
  const parsed = milestoneSchema.safeParse(body)
  if (!parsed.success) return null
  const d = parsed.data
  return {
    title: d.title,
    description: d.description ?? null,
    status: d.status,
    dueAt: d.dueAt ? new Date(d.dueAt) : null,
    sortOrder: d.sortOrder ?? 0,
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } })
  if (!project) return fail("Project not found", 404)

  const milestones = await prisma.milestone.findMany({
    where: { projectId },
    orderBy: [{ sortOrder: "asc" }, { dueAt: "asc" }],
    include: { _count: { select: { todos: true } } },
  })
  return ok(milestones)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } })
  if (!project) return fail("Project not found", 404)

  const body = await parseBody(request).catch(() => null)
  const data = toMilestoneData(body)
  if (!data) return fail("Invalid milestone payload", 400)

  const milestone = await prisma.milestone.create({
    data: { projectId, ...data },
  })
  await createAuditLog({
    entityType: "Milestone",
    entityId: milestone.id,
    action: "create",
    payload: { title: milestone.title },
    projectId,
    summary: `Meilenstein erstellt: ${milestone.title}`,
  })
  return ok(milestone, { status: 201 })
}
