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

function toCompanyData(input: Record<string, unknown>): Prisma.CompanyUpdateInput {
  return {
    ...input,
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

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: { createdAt: "desc" } },
      services: { orderBy: { createdAt: "desc" } },
    },
  })
  if (!company) return fail("Company not found", 404)
  return ok(company)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const previous = await prisma.company.findUnique({ where: { id }, select: { website: true } })
  if (!previous) return fail("Company not found", 404)
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = companySchema.safeParse(body)
  if (!parsed.success) return fail("Invalid company payload", 400, parsed.error.flatten())

  const company = await prisma.company.update({
    where: { id },
    data: toCompanyData(parsed.data)
  })

  await createAuditLog({
    entityType: "Company",
    entityId: id,
    action: "update",
    payload: parsed.data
  })

  if (shouldAnalyzeWebsite({ previousWebsite: previous.website, nextWebsite: company.website })) {
    await createAuditLog({
      entityType: "Company",
      entityId: id,
      action: "sync",
      payload: { rule: "website_changed", website: company.website },
      summary: "Automatisierungsregel: Website-Analyse vorgesehen",
    })
  }

  return ok(company)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const previous = await prisma.company.findUnique({ where: { id }, select: { website: true } })
  if (!previous) return fail("Company not found", 404)
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = companySchema.partial().safeParse(body)
  if (!parsed.success) return fail("Invalid company payload", 400, parsed.error.flatten())
  if (Object.keys(parsed.data).length === 0) return fail("No valid fields to update", 400)

  const company = await prisma.company.update({
    where: { id },
    data: toCompanyData(parsed.data),
  })

  await createAuditLog({
    entityType: "Company",
    entityId: id,
    action: "update",
    payload: parsed.data,
  })

  if (shouldAnalyzeWebsite({ previousWebsite: previous.website, nextWebsite: company.website })) {
    await createAuditLog({
      entityType: "Company",
      entityId: id,
      action: "sync",
      payload: { rule: "website_changed", website: company.website },
      summary: "Automatisierungsregel: Website-Analyse vorgesehen",
    })
  }

  return ok(company)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.company.delete({ where: { id } })
  await createAuditLog({
    entityType: "Company",
    entityId: id,
    action: "delete"
  })
  return ok({ deleted: true })
}
