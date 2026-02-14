import { z } from "zod"

const optionalUrl = z.string().url().optional().or(z.literal(""))

export const companySchema = z.object({
  name: z.string().min(2),
  website: optionalUrl,
  industry: z.string().optional(),
  brandTone: z.string().optional(),
  colors: z.array(z.string()).default([]),
  logoUrl: optionalUrl,
  notes: z.string().optional(),
  employeeCount: z.number().int().positive().optional(),
  foundingYear: z.number().int().min(1700).max(2100).optional(),
  websiteSystem: z.string().optional(),
  googleRating: z.number().min(1).max(5).optional(),
  googleReviewCount: z.number().int().min(0).optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  shortPitch: z.string().optional(),
  usp: z.array(z.string()).optional().or(z.string().optional()),
  positioning: z.string().optional(),
  businessModel: z.string().optional(),
  targetMarket: z.string().optional(),
  priceLevel: z.enum(["low", "medium", "high", "premium"]).optional().or(z.string().optional()),
  marketPosition: z.enum(["lokal", "national", "global"]).optional().or(z.string().optional()),
  googleAddress: z.string().optional(),
  googleMapsLink: optionalUrl,
  googleOpeningHours: z.string().optional(),
  sslEnabled: z.boolean().optional(),
  websiteReachable: z.boolean().optional(),
  avgLoadTime: z.number().int().min(0).optional(),
  socialMedia: z
    .array(
      z.object({
        platform: z.string().min(1),
        url: optionalUrl,
        status: z.enum(["active", "inactive"]).default("active"),
        followers: z.number().int().min(0).optional(),
      })
    )
    .optional()
    .or(z.string().optional()),
  techStack: z
    .object({
      cms: z.string().optional(),
      hosting: z.string().optional(),
      cdn: z.string().optional(),
      tracking: z.array(z.string()).optional(),
      seoBasics: z.string().optional(),
    })
    .optional()
    .or(z.string().optional()),
  generalEmail: z.string().email().optional().or(z.literal("")),
  generalPhone: z.string().optional(),
  supportEmail: z.string().email().optional().or(z.literal("")),
  salesEmail: z.string().email().optional().or(z.literal("")),
})

export const companyServiceSchema = z.object({
  category: z.string().min(1),
  title: z.string().min(2),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional().or(z.string().optional()),
  relevanceScore: z.number().min(0).max(1).optional(),
})

export const companyContactSchema = z.object({
  name: z.string().min(2),
  role: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  linkedIn: optionalUrl,
  responsibilities: z.string().optional(),
  isDecisionMaker: z.boolean().optional(),
  notes: z.string().optional(),
})

export const projectSchema = z.object({
  companyId: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  objective: z.string().optional(),
  targetAudience: z.string().optional(),
  primaryCTA: z.string().optional(),
  status: z.string().default("active"),
  description: z.string().optional(),
  owner: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  technologies: z.array(z.string()).optional().or(z.string().optional()),
  previewUrl: optionalUrl,
  contactPerson: z.string().optional(),
  workflowAssignmentEnabled: z.boolean().optional(),
  preferredTemplateCategories: z.array(z.string()).optional().or(z.string().optional()),
})

export const todoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["open", "in_progress", "done", "cancelled"]).default("open"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueAt: z.string().datetime().optional(),
  assignedTo: z.string().optional(),
  milestoneId: z.string().optional(),
})

export const milestoneSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["planned", "in_progress", "done"]).default("planned"),
  dueAt: z.string().datetime().optional(),
  sortOrder: z.number().int().optional(),
})

export const offerSchema = z.object({
  number: z.string().min(1),
  status: z.enum(["draft", "sent", "accepted", "declined"]).default("draft"),
  amount: z.number().optional(),
  pdfUrl: optionalUrl,
  milestoneId: z.string().optional(),
})

export const invoiceSchema = z.object({
  number: z.string().min(1),
  status: z.enum(["draft", "sent", "paid"]).default("draft"),
  amount: z.number().optional(),
  dueAt: z.string().datetime().optional(),
  paidAt: z.string().datetime().optional(),
  offerId: z.string().optional(),
})

export const designSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  sourceType: z.enum(["web", "dribbble", "local"]).default("web"),
  sourceUrl: optionalUrl,
  dribbbleId: z.string().optional(),
  dribbbleUser: z.string().optional(),
  category: z.string().optional(),
  industry: z.string().optional(),
  images: z.array(z.object({
    id: z.string(),
    kind: z.enum(["cover", "full", "hero_crop", "navbar_crop"]),
    url: z.string().url(),
    width: z.number().optional(),
    height: z.number().optional(),
  })).optional(),
  coverImageUrl: optionalUrl,
  screenshotUrl: optionalUrl,
  status: z.enum(["saved", "archived", "candidate"]).default("saved"),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
  collectionIds: z.array(z.string()).default([]),
})

export const collectionSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  designIds: z.array(z.string()).default([]),
})

export const importJobSchema = z.object({
  type: z.enum(["web_crawl", "dribbble_sync", "manual"]),
  inputData: z.record(z.string(), z.any()),
})

export const templateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  type: z.enum(["project", "component", "section"]).default("section"),
  category: z.string().optional(),
  framework: z.enum(["nextjs", "react", "html", "mixed"]).default("nextjs"),
  uiStack: z.string().optional(),
  tags: z.array(z.string()).default([]),
  layoutCode: z.string().optional(),
  placeholdersSchema: z.record(z.string(), z.any()).optional(),
  previewImageUrl: optionalUrl,
  sourceMode: z.enum(["github", "local"]).default("local"),
  repoFullName: z.string().optional(),
  defaultBranch: z.string().optional(),
  templateRootPath: z.string().optional(),
  readmePath: z.string().optional(),
  entryFile: z.string().optional(),
})

export const agentSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["content", "design", "code", "qc"]),
  modelHint: z.string().optional(),
  enabled: z.boolean().default(true),
  config: z.record(z.string(), z.any()).optional()
})

export const assetSchema = z.object({
  projectId: z.string().optional(),
  jobId: z.string().optional(),
  type: z.enum(["image", "video", "gif", "html", "bundle", "report"]),
  storageKey: z.string().min(2),
  publicUrl: optionalUrl,
  meta: z.record(z.string(), z.any()).optional()
})

export const integrationSettingSchema = z.object({
  provider: z.enum(["github", "openai", "minio", "telegram", "system"]),
  config: z.record(z.string(), z.any()).default({})
})

export const jobStatusSchema = z.enum([
  "queued",
  "running",
  "needs_review",
  "done",
  "failed"
])

export const jobStartSchema = z.object({
  companyId: z.string().min(1),
  projectId: z.string().min(1),
  templateId: z.string().optional(),
  designId: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  contentFields: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    cta: z.string().optional(),
    links: z.array(z.string()).default([])
  })
})
