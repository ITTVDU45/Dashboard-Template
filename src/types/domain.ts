export interface Company {
  id: string
  name: string
  website: string | null
  industry: string | null
  brandTone: string | null
  colors: string | null
  logoUrl: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  companyId: string
  name: string
  slug: string
  objective: string | null
  targetAudience: string | null
  primaryCTA: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export interface Design {
  id: string
  name: string
  sourceUrl: string | null
  screenshotUrl: string | null
  tags: string | null
  notes: string | null
  blueprint: string | null
  createdAt: string
  updatedAt: string
}

export interface Template {
  id: string
  name: string
  slug: string
  description: string | null
  tags: string | null
  layoutCode: string | null
  placeholdersSchema: string | null
  previewImageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface Job {
  id: string
  projectId: string
  templateId: string | null
  designId: string | null
  status: "queued" | "running" | "needs_review" | "done" | "failed"
  steps: string | null
  logs: string | null
  inputJson: string | null
  outputJson: string | null
  previewUrl: string | null
  scheduledAt: string | null
  startedAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Asset {
  id: string
  projectId: string | null
  jobId: string | null
  type: "image" | "video" | "gif" | "html" | "bundle" | "report"
  storageKey: string
  publicUrl: string | null
  meta: string | null
  createdAt: string
}

export interface Agent {
  id: string
  name: string
  type: "content" | "design" | "code" | "qc"
  modelHint: string | null
  enabled: boolean
  config: string | null
  createdAt: string
  updatedAt: string
}

export interface IntegrationSetting {
  id: string
  provider: "github" | "openai" | "minio" | "telegram" | "system"
  config: string | null
  createdAt: string
  updatedAt: string
}

export interface AuditLog {
  id: string
  actor: string
  entityType: string
  entityId: string
  action: "create" | "update" | "delete"
  payload: string | null
  createdAt: string
}
