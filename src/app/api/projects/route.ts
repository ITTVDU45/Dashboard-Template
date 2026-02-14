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

  const project = await prisma.project.create({ data: parsed.data })
  await createAuditLog({
    entityType: "Project",
    entityId: project.id,
    action: "create",
    payload: parsed.data
  })
  return ok(project, { status: 201 })
}
