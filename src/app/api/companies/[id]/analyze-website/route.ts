import { prisma } from "@/lib/prisma"
import { fail, ok } from "@/lib/api-helpers"
import { analyzeBusinessModel, generateDescription, generateServices } from "@/lib/ai/company-generator"
import { detectTechStack, extractContacts, extractServices, scrapeWebsite } from "@/lib/scraper"
import { createAuditLog } from "@/lib/audit"

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await prisma.company.findUnique({ where: { id } })
  if (!company) return fail("Company not found", 404)
  if (!company.website) return fail("Website fehlt. Bitte zuerst Website hinterlegen.", 400)

  try {
    const scraped = await scrapeWebsite(company.website)
    const contacts = extractContacts(scraped.html)
    const scrapedServices = extractServices(scraped.html)
    const techStack = await detectTechStack(company.website)
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
    const aiServices = await generateServices(scraped.text, company.industry)
    const services = aiServices.length > 0 ? aiServices : scrapedServices

    await prisma.company.update({
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
        websiteSystem: techStack.cms ?? company.websiteSystem,
        techStack: JSON.stringify(techStack),
        websiteReachable: true,
        sslEnabled: company.website.startsWith("https://"),
      },
    })

    if (services.length > 0) {
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
    }

    if (contacts.length > 0) {
      await prisma.companyContact.createMany({
        data: contacts.slice(0, 5).map((contact) => ({
          companyId: id,
          name: contact.name || contact.email || contact.phone || "Kontakt",
          email: contact.email ?? null,
          phone: contact.phone ?? null,
          linkedIn: contact.linkedIn ?? null,
          role: null,
          responsibilities: null,
          isDecisionMaker: false,
          notes: "Automatisch aus Website extrahiert",
        })),
      })
    }

    await createAuditLog({
      entityType: "Company",
      entityId: id,
      action: "sync",
      payload: { website: company.website },
      summary: `Website analysiert fur ${company.name}`,
    })

    return ok({
      companyId: id,
      servicesAdded: services.length,
      contactsAdded: contacts.length,
      websiteSystem: techStack.cms ?? null,
    })
  } catch (error) {
    return fail("Website-Analyse fehlgeschlagen", 500, error instanceof Error ? error.message : "unknown error")
  }
}
