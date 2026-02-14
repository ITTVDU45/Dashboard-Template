import { prisma } from "@/lib/prisma"
import { parseJsonArray, parseJsonObject } from "@/lib/serializers"
import type { CompanyContext } from "@/lib/db/types"

export type ProjectContext = CompanyContext

export async function getCompanyContextForProject(companyId: string): Promise<ProjectContext | null> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      id: true,
      name: true,
      industry: true,
      brandTone: true,
      colors: true,
      description: true,
      shortPitch: true,
      usp: true,
      targetMarket: true,
      techStack: true,
      websiteSystem: true,
    },
  })
  if (!company) return null

  return {
    companyId: company.id,
    name: company.name,
    industry: company.industry,
    brandTone: company.brandTone,
    colors: parseJsonArray(company.colors),
    description: company.description,
    shortPitch: company.shortPitch,
    usp: parseJsonArray(company.usp),
    targetMarket: company.targetMarket,
    techStack: parseJsonObject<Record<string, unknown> | null>(company.techStack, null),
    websiteSystem: company.websiteSystem,
  }
}
