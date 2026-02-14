import { parseJsonArray, parseJsonObject } from "@/lib/serializers"

interface CompanyRuleInput {
  previousWebsite: string | null | undefined
  nextWebsite: string | null | undefined
}

interface CompanyPrefillSource {
  shortPitch?: string | null
  targetMarket?: string | null
  usp?: string | null
  websiteSystem?: string | null
  techStack?: string | null
}

export function shouldAnalyzeWebsite({ previousWebsite, nextWebsite }: CompanyRuleInput) {
  if (!nextWebsite) return false
  if (!previousWebsite && nextWebsite) return true
  return previousWebsite !== nextWebsite
}

export function getProjectPrefillFromCompany(source: CompanyPrefillSource) {
  const usp = parseJsonArray(source.usp)
  const tech = parseJsonObject<Record<string, unknown>>(source.techStack, {})
  const inferredTech = [
    source.websiteSystem ?? undefined,
    typeof tech.cms === "string" ? tech.cms : undefined,
    ...(Array.isArray(tech.tracking) ? tech.tracking.filter((entry): entry is string => typeof entry === "string") : []),
  ].filter((entry): entry is string => Boolean(entry))

  return {
    objective: source.shortPitch ?? "",
    targetAudience: source.targetMarket ?? "",
    primaryCTA: usp[0] ?? "",
    technologies: inferredTech,
  }
}
