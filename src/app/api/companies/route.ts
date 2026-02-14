import { prisma } from "@/lib/prisma"
import { companySchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

export async function GET() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" }
  })
  return ok(companies)
}

export async function POST(request: Request) {
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = companySchema.safeParse(body)
  if (!parsed.success) return fail("Invalid company payload", 400, parsed.error.flatten())

  const company = await prisma.company.create({
    data: {
      ...parsed.data,
      website: parsed.data.website || null,
      logoUrl: parsed.data.logoUrl || null,
      colors: JSON.stringify(parsed.data.colors)
    }
  })

  await createAuditLog({
    entityType: "Company",
    entityId: company.id,
    action: "create",
    payload: parsed.data
  })

  return ok(company, { status: 201 })
}
