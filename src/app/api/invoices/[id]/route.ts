import { invoiceSchema } from "@/lib/validations"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

function toInvoiceUpdate(body: unknown) {
  const parsed = invoiceSchema.partial().safeParse(body)
  if (!parsed.success) return null
  const d = parsed.data
  return {
    ...(d.number !== undefined && { number: d.number }),
    ...(d.status !== undefined && { status: d.status }),
    ...(d.amount !== undefined && { amount: d.amount }),
    ...(d.dueAt !== undefined && { dueAt: d.dueAt ? new Date(d.dueAt) : null }),
    ...(d.paidAt !== undefined && { paidAt: d.paidAt ? new Date(d.paidAt) : null }),
    ...(d.offerId !== undefined && { offerId: d.offerId ?? null }),
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, name: true } },
      offer: { select: { id: true, number: true } },
    },
  })
  if (!invoice) return fail("Invoice not found", 404)
  return ok(invoice)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = await prisma.invoice.findUnique({ where: { id }, select: { id: true, projectId: true, number: true } })
  if (!existing) return fail("Invoice not found", 404)

  const body = await parseBody(request).catch(() => null)
  const data = toInvoiceUpdate(body)
  if (!data || Object.keys(data).length === 0) return fail("No valid fields to update", 400)

  const invoice = await prisma.invoice.update({
    where: { id },
    data,
    include: { offer: { select: { id: true, number: true } } },
  })
  await createAuditLog({
    entityType: "Invoice",
    entityId: id,
    action: "update",
    payload: data,
    projectId: existing.projectId,
    summary: `Rechnung aktualisiert: ${invoice.number}`,
  })
  return ok(invoice)
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = await prisma.invoice.findUnique({ where: { id }, select: { id: true, projectId: true, number: true } })
  if (!existing) return fail("Invoice not found", 404)

  await prisma.invoice.delete({ where: { id } })
  await createAuditLog({
    entityType: "Invoice",
    entityId: id,
    action: "delete",
    payload: { number: existing.number },
    projectId: existing.projectId,
    summary: `Rechnung gelöscht: ${existing.number}`,
  })
  return ok({ deleted: id })
}
