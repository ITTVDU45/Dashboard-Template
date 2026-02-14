import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } })
  if (!project) return fail("Project not found", 404)

  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || undefined
  const entityByType: Record<string, string> = {
    tasks: "Todo",
    milestones: "Milestone",
    jobs: "Job",
    assets: "Asset",
    Note: "Note",
  }
  const whereType =
    !type || type === "all"
      ? {}
      : type === "finance"
        ? { entityType: { in: ["Offer", "Invoice"] } }
        : entityByType[type]
          ? { entityType: entityByType[type] }
          : {}
  const logs = await prisma.auditLog.findMany({
    where: { projectId, ...whereType },
    orderBy: { createdAt: "desc" },
    take: 100,
  })
  return ok(logs)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } })
  if (!project) return fail("Project not found", 404)

  const body = await parseBody<{ summary: string }>(request).catch(() => null)
  const parsed = z.object({ summary: z.string().min(1) }).safeParse(body)
  if (!parsed.success) return fail("Summary required", 400, parsed.error.flatten())

  const log = await createAuditLog({
    entityType: "Note",
    entityId: projectId,
    action: "create",
    payload: { summary: parsed.data.summary },
    projectId,
    summary: parsed.data.summary,
  })
  return ok(log, { status: 201 })
}
