import { prisma } from "@/lib/prisma"

interface CreateAuditLogInput {
  actor?: string
  entityType: string
  entityId: string
  action: "create" | "update" | "delete" | "sync"
  payload?: unknown
}

export async function createAuditLog({
  actor = "admin",
  entityType,
  entityId,
  action,
  payload
}: CreateAuditLogInput) {
  return prisma.auditLog.create({
    data: {
      actor,
      entityType,
      entityId,
      action,
      payload: payload ? JSON.stringify(payload) : null
    }
  })
}
