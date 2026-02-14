import { prisma } from "@/lib/prisma"
import { projectSchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: { company: true, jobs: true, assets: true }
  })
  if (!project) return fail("Project not found", 404)
  return ok(project)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = projectSchema.safeParse(body)
  if (!parsed.success) return fail("Invalid project payload", 400, parsed.error.flatten())

  const project = await prisma.project.update({ where: { id }, data: parsed.data })
  await createAuditLog({
    entityType: "Project",
    entityId: id,
    action: "update",
    payload: parsed.data
  })
  return ok(project)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.project.delete({ where: { id } })
  await createAuditLog({ entityType: "Project", entityId: id, action: "delete" })
  return ok({ deleted: true })
}
