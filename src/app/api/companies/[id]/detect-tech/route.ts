import { prisma } from "@/lib/prisma"
import { fail, ok } from "@/lib/api-helpers"
import { detectTechStack } from "@/lib/scraper"
import { createAuditLog } from "@/lib/audit"

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await prisma.company.findUnique({ where: { id } })
  if (!company) return fail("Company not found", 404)
  if (!company.website) return fail("Website fehlt. Bitte zuerst Website hinterlegen.", 400)

  try {
    const tech = await detectTechStack(company.website)
    const updated = await prisma.company.update({
      where: { id },
      data: {
        websiteSystem: tech.cms ?? company.websiteSystem,
        techStack: JSON.stringify(tech),
      },
    })

    await createAuditLog({
      entityType: "Company",
      entityId: id,
      action: "sync",
      summary: `Tech-Stack analysiert fur ${company.name}`,
    })

    return ok(updated)
  } catch (error) {
    return fail("Tech-Analyse fehlgeschlagen", 500, error instanceof Error ? error.message : "unknown error")
  }
}
