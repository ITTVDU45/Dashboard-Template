import { prisma } from "@/lib/prisma"
import { fail, ok } from "@/lib/api-helpers"
import { extractServices, scrapeWebsite } from "@/lib/scraper"
import { generateServices } from "@/lib/ai/company-generator"
import { createAuditLog } from "@/lib/audit"

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await prisma.company.findUnique({ where: { id } })
  if (!company) return fail("Company not found", 404)
  if (!company.website) return fail("Website fehlt. Bitte zuerst Website hinterlegen.", 400)

  try {
    const scraped = await scrapeWebsite(company.website)
    const aiServices = await generateServices(scraped.text, company.industry)
    const fallbackServices = extractServices(scraped.html)
    const services = aiServices.length > 0 ? aiServices : fallbackServices
    if (services.length === 0) return ok({ inserted: 0 })

    await prisma.companyService.createMany({
      data: services.slice(0, 10).map((service) => ({
        companyId: id,
        category: service.category || "Allgemein",
        title: service.title,
        description: service.description ?? null,
        keywords: JSON.stringify(service.keywords ?? []),
        relevanceScore: null,
      })),
    })

    await createAuditLog({
      entityType: "Company",
      entityId: id,
      action: "sync",
      summary: `${services.length} Leistungen aus Website extrahiert`,
    })

    return ok({ inserted: services.length })
  } catch (error) {
    return fail("Leistungen konnten nicht extrahiert werden", 500, error instanceof Error ? error.message : "unknown error")
  }
}
