import { prisma } from "@/lib/prisma"
import { projectSchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { company: true },
    orderBy: { createdAt: "desc" }
  })
  return ok(projects)
}

export async function POST(request: Request) {
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = projectSchema.safeParse(body)
  if (!parsed.success) return fail("Invalid project payload", 400, parsed.error.flatten())

  const data = {
    ...parsed.data,
    technologies: Array.isArray(parsed.data.technologies)
      ? JSON.stringify(parsed.data.technologies)
      : (parsed.data.technologies ?? null),
    preferredTemplateCategories: Array.isArray(parsed.data.preferredTemplateCategories)
      ? JSON.stringify(parsed.data.preferredTemplateCategories)
      : (parsed.data.preferredTemplateCategories ?? null),
    startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
    endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
  }
  const project = await prisma.project.create({ data })
  await createAuditLog({
    entityType: "Project",
    entityId: project.id,
    action: "create",
    payload: parsed.data,
    projectId: project.id,
    summary: `Projekt erstellt: ${project.name}`,
  })
  return ok(project, { status: 201 })
}
