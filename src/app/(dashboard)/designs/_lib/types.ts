export interface ImageData {
  id: string
  kind: "cover" | "full" | "hero_crop" | "navbar_crop"
  url: string
  width?: number
  height?: number
}

export interface DesignData {
  id: string
  name: string
  description: string | null
  sourceType: string
  sourceUrl: string | null
  dribbbleId: string | null
  dribbbleUser: string | null
  category: string | null
  industry: string | null
  images: string | null // JSON
  coverImageUrl: string | null
  screenshotUrl: string | null
  status: string
  dedupeKey: string | null
  tags: string | null // JSON
  notes: string | null
  blueprint: string | null
  usesCount: number
  lastUsedAt: string | null
  collectionIds: string | null // JSON
  createdAt: string
  updatedAt: string
}

export interface CollectionData {
  id: string
  name: string
  description: string | null
  designIds: string | null // JSON
  createdAt: string
  updatedAt: string
}

export interface ImportJobData {
  id: string
  type: string
  inputData: string | null // JSON
  status: string
  resultDesignId: string | null
  errorMessage: string | null
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

export interface DesignFilters {
  search: string
  category: string
  industry: string
  sourceType: string
  status: string
  collection: string
}

export type DesignSortKey = "newest" | "updated" | "uses" | "name"

export interface SortOption {
  value: DesignSortKey
  label: string
}
