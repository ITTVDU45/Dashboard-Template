import { offerSchema } from "@/lib/validations"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

function toOfferData(body: unknown) {
  const parsed = offerSchema.safeParse(body)
  if (!parsed.success) return null
  const d = parsed.data
  return {
    number: d.number,
    status: d.status,
    amount: d.amount ?? null,
    pdfUrl: d.pdfUrl ?? null,
    milestoneId: d.milestoneId ?? null,
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } })
  if (!project) return fail("Project not found", 404)

  const offers = await prisma.offer.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: { milestone: { select: { id: true, title: true } } },
  })
  return ok(offers)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } })
  if (!project) return fail("Project not found", 404)

  const body = await parseBody(request).catch(() => null)
  const data = toOfferData(body)
  if (!data) return fail("Invalid offer payload", 400)

  const offer = await prisma.offer.create({
    data: { projectId, ...data },
    include: { milestone: { select: { id: true, title: true } } },
  })
  await createAuditLog({
    entityType: "Offer",
    entityId: offer.id,
    action: "create",
    payload: { number: offer.number },
    projectId,
    summary: `Angebot erstellt: ${offer.number}`,
  })
  return ok(offer, { status: 201 })
}
