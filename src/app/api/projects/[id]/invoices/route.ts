import { invoiceSchema } from "@/lib/validations"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

function toInvoiceData(body: unknown) {
  const parsed = invoiceSchema.safeParse(body)
  if (!parsed.success) return null
  const d = parsed.data
  return {
    number: d.number,
    status: d.status,
    amount: d.amount ?? null,
    dueAt: d.dueAt ? new Date(d.dueAt) : null,
    paidAt: d.paidAt ? new Date(d.paidAt) : null,
    offerId: d.offerId ?? null,
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } })
  if (!project) return fail("Project not found", 404)

  const invoices = await prisma.invoice.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: { offer: { select: { id: true, number: true } } },
  })
  return ok(invoices)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } })
  if (!project) return fail("Project not found", 404)

  const body = await parseBody(request).catch(() => null)
  const data = toInvoiceData(body)
  if (!data) return fail("Invalid invoice payload", 400)

  const invoice = await prisma.invoice.create({
    data: { projectId, ...data },
    include: { offer: { select: { id: true, number: true } } },
  })
  await createAuditLog({
    entityType: "Invoice",
    entityId: invoice.id,
    action: "create",
    payload: { number: invoice.number },
    projectId,
    summary: `Rechnung erstellt: ${invoice.number}`,
  })
  return ok(invoice, { status: 201 })
}
