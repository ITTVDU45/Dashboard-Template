import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { fail, ok } from "@/lib/api-helpers"

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: offerId } = await params
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    select: { id: true, projectId: true, number: true, amount: true, status: true },
  })
  if (!offer) return fail("Offer not found", 404)
  if (offer.status !== "accepted") return fail("Only accepted offers can be converted to invoice", 400)

  const existingInvoice = await prisma.invoice.findFirst({
    where: { offerId },
    select: { id: true, number: true },
  })
  if (existingInvoice) return fail("Invoice already created for this offer", 400)

  const count = await prisma.invoice.count({ where: { projectId: offer.projectId } })
  const invoiceNumber = `R-${offer.projectId.slice(-6)}-${String(count + 1).padStart(3, "0")}`

  const invoice = await prisma.invoice.create({
    data: {
      projectId: offer.projectId,
      offerId: offer.id,
      number: invoiceNumber,
      status: "draft",
      amount: offer.amount,
    },
  })
  await createAuditLog({
    entityType: "Invoice",
    entityId: invoice.id,
    action: "create",
    payload: { number: invoice.number, fromOffer: offer.number },
    projectId: offer.projectId,
    summary: `Rechnung aus Angebot erstellt: ${invoice.number}`,
  })
  return ok(invoice, { status: 201 })
}
