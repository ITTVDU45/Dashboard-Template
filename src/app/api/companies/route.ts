import { prisma } from "@/lib/prisma"
import { companySchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"
import { shouldAnalyzeWebsite } from "@/lib/automation/company-rules"
import type { Prisma } from "@prisma/client"

function toNullableString(value: unknown): string | null {
  if (typeof value !== "string") return null
  return value.trim() ? value : null
}

function toCompanyData(input: Record<string, unknown>): Prisma.CompanyCreateInput {
  return {
    ...input,
    name: String(input.name ?? ""),
    website: toNullableString(input.website),
    logoUrl: toNullableString(input.logoUrl),
    colors: JSON.stringify(Array.isArray(input.colors) ? input.colors : []),
    usp: Array.isArray(input.usp) ? JSON.stringify(input.usp) : toNullableString(input.usp),
    socialMedia: Array.isArray(input.socialMedia) ? JSON.stringify(input.socialMedia) : toNullableString(input.socialMedia),
    techStack:
      input.techStack && typeof input.techStack === "object"
        ? JSON.stringify(input.techStack)
        : toNullableString(input.techStack),
    googleMapsLink: toNullableString(input.googleMapsLink),
    generalEmail: toNullableString(input.generalEmail),
    supportEmail: toNullableString(input.supportEmail),
    salesEmail: toNullableString(input.salesEmail),
  }
}

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
    data: toCompanyData(parsed.data)
  })

  await createAuditLog({
    entityType: "Company",
    entityId: company.id,
    action: "create",
    payload: parsed.data
  })

  if (shouldAnalyzeWebsite({ previousWebsite: null, nextWebsite: company.website })) {
    await createAuditLog({
      entityType: "Company",
      entityId: company.id,
      action: "sync",
      payload: { rule: "website_changed", website: company.website },
      summary: "Automatisierungsregel: Website-Analyse vorgesehen",
    })
  }

  return ok(company, { status: 201 })
}
