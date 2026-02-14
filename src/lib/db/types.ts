export interface Lead {
  id: string
  companyId: string
  projectId?: string
  phone?: string | null
  email?: string | null
  source?: string | null
  payload?: Record<string, unknown>
  createdAt: string
}

export interface CompanyContext {
  companyId: string
  name: string
  industry: string | null
  brandTone: string | null
  colors: string[]
  description: string | null
  shortPitch: string | null
  usp: string[]
  targetMarket: string | null
  techStack: Record<string, unknown> | null
  websiteSystem: string | null
}
