import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { companyContactSchema } from "@/lib/validations"
import { fail, ok, parseBody } from "@/lib/api-helpers"

function toContactUpdate(body: unknown) {
  const parsed = companyContactSchema.partial().safeParse(body)
  if (!parsed.success) return null
  const data = parsed.data
  return {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.role !== undefined && { role: data.role ?? null }),
    ...(data.email !== undefined && { email: data.email ?? null }),
    ...(data.phone !== undefined && { phone: data.phone ?? null }),
    ...(data.linkedIn !== undefined && { linkedIn: data.linkedIn ?? null }),
    ...(data.responsibilities !== undefined && { responsibilities: data.responsibilities ?? null }),
    ...(data.isDecisionMaker !== undefined && { isDecisionMaker: data.isDecisionMaker }),
    ...(data.notes !== undefined && { notes: data.notes ?? null }),
  }
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contact = await prisma.companyContact.findUnique({ where: { id } })
  if (!contact) return fail("Contact not found", 404)
  return ok(contact)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const existing = await prisma.companyContact.findUnique({ where: { id }, select: { id: true, name: true } })
  if (!existing) return fail("Contact not found", 404)

  const body = await parseBody(request).catch(() => null)
  const data = toContactUpdate(body)
  if (!data || Object.keys(data).length === 0) return fail("No valid fields to update", 400)

  const contact = await prisma.companyContact.update({ where: { id }, data })

  await createAuditLog({
    entityType: "CompanyContact",
    entityId: id,
    action: "update",
    payload: data,
    summary: `Ansprechpartner aktualisiert: ${contact.name}`,
  })

  return ok(contact)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const existing = await prisma.companyContact.findUnique({ where: { id }, select: { id: true, name: true } })
  if (!existing) return fail("Contact not found", 404)

  await prisma.companyContact.delete({ where: { id } })
  await createAuditLog({
    entityType: "CompanyContact",
    entityId: id,
    action: "delete",
    payload: { name: existing.name },
    summary: `Ansprechpartner gelöscht: ${existing.name}`,
  })

  return ok({ deleted: id })
}
