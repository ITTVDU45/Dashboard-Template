import { prisma } from "@/lib/prisma"
import { companySchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await prisma.company.findUnique({ where: { id } })
  if (!company) return fail("Company not found", 404)
  return ok(company)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = companySchema.safeParse(body)
  if (!parsed.success) return fail("Invalid company payload", 400, parsed.error.flatten())

  const company = await prisma.company.update({
    where: { id },
    data: {
      ...parsed.data,
      website: parsed.data.website || null,
      logoUrl: parsed.data.logoUrl || null,
      colors: JSON.stringify(parsed.data.colors)
    }
  })

  await createAuditLog({
    entityType: "Company",
    entityId: id,
    action: "update",
    payload: parsed.data
  })

  return ok(company)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.company.delete({ where: { id } })
  await createAuditLog({
    entityType: "Company",
    entityId: id,
    action: "delete"
  })
  return ok({ deleted: true })
}
