import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { companyServiceSchema } from "@/lib/validations"
import { fail, ok, parseBody } from "@/lib/api-helpers"

function toServiceData(body: unknown) {
  const parsed = companyServiceSchema.safeParse(body)
  if (!parsed.success) return null
  const data = parsed.data
  return {
    category: data.category,
    title: data.title,
    description: data.description ?? null,
    keywords: Array.isArray(data.keywords) ? JSON.stringify(data.keywords) : data.keywords ?? null,
    relevanceScore: data.relevanceScore ?? null,
  }
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: companyId } = await params
  const company = await prisma.company.findUnique({ where: { id: companyId }, select: { id: true } })
  if (!company) return fail("Company not found", 404)

  const services = await prisma.companyService.findMany({
    where: { companyId },
    orderBy: [{ relevanceScore: "desc" }, { createdAt: "desc" }],
  })

  return ok(services)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: companyId } = await params
  const company = await prisma.company.findUnique({ where: { id: companyId }, select: { id: true } })
  if (!company) return fail("Company not found", 404)

  const body = await parseBody(request).catch(() => null)
  const data = toServiceData(body)
  if (!data) return fail("Invalid service payload", 400)

  const service = await prisma.companyService.create({ data: { companyId, ...data } })

  await createAuditLog({
    entityType: "CompanyService",
    entityId: service.id,
    action: "create",
    payload: { title: service.title, category: service.category },
    summary: `Leistung erstellt: ${service.title}`,
  })

  return ok(service, { status: 201 })
}
