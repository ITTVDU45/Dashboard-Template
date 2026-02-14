import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { companyServiceSchema } from "@/lib/validations"
import { fail, ok, parseBody } from "@/lib/api-helpers"

function toServiceUpdate(body: unknown) {
  const parsed = companyServiceSchema.partial().safeParse(body)
  if (!parsed.success) return null
  const data = parsed.data
  return {
    ...(data.category !== undefined && { category: data.category }),
    ...(data.title !== undefined && { title: data.title }),
    ...(data.description !== undefined && { description: data.description ?? null }),
    ...(data.keywords !== undefined && {
      keywords: Array.isArray(data.keywords) ? JSON.stringify(data.keywords) : data.keywords ?? null,
    }),
    ...(data.relevanceScore !== undefined && { relevanceScore: data.relevanceScore ?? null }),
  }
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await prisma.companyService.findUnique({ where: { id } })
  if (!service) return fail("Service not found", 404)
  return ok(service)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const existing = await prisma.companyService.findUnique({ where: { id }, select: { id: true, title: true } })
  if (!existing) return fail("Service not found", 404)

  const body = await parseBody(request).catch(() => null)
  const data = toServiceUpdate(body)
  if (!data || Object.keys(data).length === 0) return fail("No valid fields to update", 400)

  const service = await prisma.companyService.update({ where: { id }, data })

  await createAuditLog({
    entityType: "CompanyService",
    entityId: id,
    action: "update",
    payload: data,
    summary: `Leistung aktualisiert: ${service.title}`,
  })

  return ok(service)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const existing = await prisma.companyService.findUnique({ where: { id }, select: { id: true, title: true } })
  if (!existing) return fail("Service not found", 404)

  await prisma.companyService.delete({ where: { id } })
  await createAuditLog({
    entityType: "CompanyService",
    entityId: id,
    action: "delete",
    payload: { title: existing.title },
    summary: `Leistung gelöscht: ${existing.title}`,
  })

  return ok({ deleted: id })
}
