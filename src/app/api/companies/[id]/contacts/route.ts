import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { companyContactSchema } from "@/lib/validations"
import { fail, ok, parseBody } from "@/lib/api-helpers"

function toContactData(body: unknown) {
  const parsed = companyContactSchema.safeParse(body)
  if (!parsed.success) return null
  const data = parsed.data
  return {
    name: data.name,
    role: data.role ?? null,
    email: data.email ?? null,
    phone: data.phone ?? null,
    linkedIn: data.linkedIn ?? null,
    responsibilities: data.responsibilities ?? null,
    isDecisionMaker: data.isDecisionMaker ?? false,
    notes: data.notes ?? null,
  }
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: companyId } = await params
  const company = await prisma.company.findUnique({ where: { id: companyId }, select: { id: true } })
  if (!company) return fail("Company not found", 404)

  const contacts = await prisma.companyContact.findMany({
    where: { companyId },
    orderBy: [{ isDecisionMaker: "desc" }, { createdAt: "desc" }],
  })

  return ok(contacts)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: companyId } = await params
  const company = await prisma.company.findUnique({ where: { id: companyId }, select: { id: true } })
  if (!company) return fail("Company not found", 404)

  const body = await parseBody(request).catch(() => null)
  const data = toContactData(body)
  if (!data) return fail("Invalid contact payload", 400)

  const contact = await prisma.companyContact.create({ data: { companyId, ...data } })

  await createAuditLog({
    entityType: "CompanyContact",
    entityId: contact.id,
    action: "create",
    payload: { name: contact.name, role: contact.role },
    summary: `Ansprechpartner erstellt: ${contact.name}`,
  })

  return ok(contact, { status: 201 })
}
