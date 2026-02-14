import { prisma } from "@/lib/prisma"
import { projectSchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

function toProjectData(raw: Record<string, unknown>) {
  const data: Record<string, unknown> = { ...raw }
  if (Array.isArray(raw.technologies)) data.technologies = JSON.stringify(raw.technologies)
  if (Array.isArray(raw.preferredTemplateCategories)) data.preferredTemplateCategories = JSON.stringify(raw.preferredTemplateCategories)
  if (typeof raw.startDate === "string") data.startDate = raw.startDate ? new Date(raw.startDate) : null
  if (typeof raw.endDate === "string") data.endDate = raw.endDate ? new Date(raw.endDate) : null
  return data
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      company: true,
      jobs: { orderBy: { createdAt: "desc" } },
      assets: true,
      todos: true,
      milestones: { orderBy: { sortOrder: "asc" } },
      offers: true,
      invoices: true,
    },
  })
  if (!project) return fail("Project not found", 404)
  return ok(project)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = projectSchema.safeParse(body)
  if (!parsed.success) return fail("Invalid project payload", 400, parsed.error.flatten())

  const data = toProjectData(parsed.data as Record<string, unknown>)
  const project = await prisma.project.update({ where: { id }, data })
  await createAuditLog({
    entityType: "Project",
    entityId: id,
    action: "update",
    payload: parsed.data,
    projectId: id,
    summary: `Projekt aktualisiert: ${project.name}`,
  })
  return ok(project)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await parseBody<Record<string, unknown>>(request).catch(() => null)
  if (!body) return fail("Invalid body", 400)

  const data = toProjectData(body)
  const project = await prisma.project.update({ where: { id }, data })
  await createAuditLog({
    entityType: "Project",
    entityId: id,
    action: "update",
    payload: body,
    projectId: id,
    summary: "Projekt aktualisiert",
  })
  return ok(project)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id }, select: { name: true } })
  await prisma.project.delete({ where: { id } })
  await createAuditLog({
    entityType: "Project",
    entityId: id,
    action: "delete",
    projectId: id,
    summary: project ? `Projekt gelöscht: ${project.name}` : "Projekt gelöscht",
  })
  return ok({ deleted: true })
}
