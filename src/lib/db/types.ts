export interface Lead {
  id: string
  companyId: string
  projectId?: string
  phone?: string
  payload: Record<string, unknown>
  createdAt: string
}
