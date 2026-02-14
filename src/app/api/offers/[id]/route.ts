import { offerSchema } from "@/lib/validations"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

function toOfferUpdate(body: unknown) {
  const parsed = offerSchema.partial().safeParse(body)
  if (!parsed.success) return null
  const d = parsed.data
  return {
    ...(d.number !== undefined && { number: d.number }),
    ...(d.status !== undefined && { status: d.status }),
    ...(d.amount !== undefined && { amount: d.amount }),
    ...(d.pdfUrl !== undefined && { pdfUrl: d.pdfUrl ?? null }),
    ...(d.milestoneId !== undefined && { milestoneId: d.milestoneId ?? null }),
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const offer = await prisma.offer.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, name: true } },
      milestone: { select: { id: true, title: true } },
      invoices: { select: { id: true, number: true, status: true } },
    },
  })
  if (!offer) return fail("Offer not found", 404)
  return ok(offer)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = await prisma.offer.findUnique({ where: { id }, select: { id: true, projectId: true, number: true } })
  if (!existing) return fail("Offer not found", 404)

  const body = await parseBody(request).catch(() => null)
  const data = toOfferUpdate(body)
  if (!data || Object.keys(data).length === 0) return fail("No valid fields to update", 400)

  const offer = await prisma.offer.update({
    where: { id },
    data,
    include: { milestone: { select: { id: true, title: true } } },
  })
  await createAuditLog({
    entityType: "Offer",
    entityId: id,
    action: "update",
    payload: data,
    projectId: existing.projectId,
    summary: `Angebot aktualisiert: ${offer.number}`,
  })
  return ok(offer)
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = await prisma.offer.findUnique({ where: { id }, select: { id: true, projectId: true, number: true } })
  if (!existing) return fail("Offer not found", 404)

  await prisma.offer.delete({ where: { id } })
  await createAuditLog({
    entityType: "Offer",
    entityId: id,
    action: "delete",
    payload: { number: existing.number },
    projectId: existing.projectId,
    summary: `Angebot gelöscht: ${existing.number}`,
  })
  return ok({ deleted: id })
}
