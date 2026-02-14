import { prisma } from "@/lib/prisma"
import { agentSchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const agent = await prisma.agent.findUnique({ where: { id } })
  if (!agent) return fail("Agent not found", 404)
  return ok(agent)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = agentSchema.safeParse(body)
  if (!parsed.success) return fail("Invalid agent payload", 400, parsed.error.flatten())

  const agent = await prisma.agent.update({
    where: { id },
    data: {
      ...parsed.data,
      config: parsed.data.config ? JSON.stringify(parsed.data.config) : null
    }
  })

  await createAuditLog({ entityType: "Agent", entityId: id, action: "update", payload: parsed.data })
  return ok(agent)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.agent.delete({ where: { id } })
  await createAuditLog({ entityType: "Agent", entityId: id, action: "delete" })
  return ok({ deleted: true })
}
