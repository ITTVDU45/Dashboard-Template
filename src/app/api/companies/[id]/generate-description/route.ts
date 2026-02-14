import { prisma } from "@/lib/prisma"
import { fail, ok } from "@/lib/api-helpers"
import { analyzeBusinessModel, generateDescription, generateServices } from "@/lib/ai/company-generator"
import { scrapeWebsite } from "@/lib/scraper"
import { createAuditLog } from "@/lib/audit"

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await prisma.company.findUnique({ where: { id } })
  if (!company) return fail("Company not found", 404)
  if (!company.website) return fail("Website fehlt. Bitte zuerst Website hinterlegen.", 400)

  try {
    const scraped = await scrapeWebsite(company.website)
    const description = await generateDescription({
      name: company.name,
      industry: company.industry,
      website: company.website,
      brandTone: company.brandTone,
      scrapedText: scraped.text,
    })
    const business = await analyzeBusinessModel({
      name: company.name,
      industry: company.industry,
      description: description.description,
      scrapedText: scraped.text,
    })
    const services = await generateServices(scraped.text, company.industry)

    const updated = await prisma.company.update({
      where: { id },
      data: {
        description: description.description,
        shortPitch: description.shortPitch,
        usp: JSON.stringify(description.usp),
        positioning: description.positioning,
        businessModel: business.businessModel,
        targetMarket: business.targetMarket,
        priceLevel: business.priceLevel,
        marketPosition: business.marketPosition,
      },
    })

    await createAuditLog({
      entityType: "Company",
      entityId: id,
      action: "sync",
      summary: `Beschreibung neu generiert fur ${company.name}`,
    })

    if (services.length > 0) {
      await prisma.companyService.createMany({
        data: services.slice(0, 6).map((service) => ({
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
        payload: { rule: "description_generated_extract_services", added: services.length },
        summary: "Automatisierungsregel: Leistungen nach Beschreibung aktualisiert",
      })
    }

    return ok(updated)
  } catch (error) {
    return fail("Beschreibung konnte nicht generiert werden", 500, error instanceof Error ? error.message : "unknown error")
  }
}
