import { z } from "zod"

const optionalUrl = z.string().url().optional().or(z.literal(""))

export const companySchema = z.object({
  name: z.string().min(2),
  website: optionalUrl,
  industry: z.string().optional(),
  brandTone: z.string().optional(),
  colors: z.array(z.string()).default([]),
  logoUrl: optionalUrl,
  notes: z.string().optional()
})

export const projectSchema = z.object({
  companyId: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  objective: z.string().optional(),
  targetAudience: z.string().optional(),
  primaryCTA: z.string().optional(),
  status: z.string().default("active")
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
