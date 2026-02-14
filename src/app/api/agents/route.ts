import { prisma } from "@/lib/prisma"
import { agentSchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

export async function GET() {
  const agents = await prisma.agent.findMany({ orderBy: { createdAt: "desc" } })
  return ok(agents)
}

export async function POST(request: Request) {
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = agentSchema.safeParse(body)
  if (!parsed.success) return fail("Invalid agent payload", 400, parsed.error.flatten())

  const agent = await prisma.agent.create({
    data: {
      ...parsed.data,
      config: parsed.data.config ? JSON.stringify(parsed.data.config) : null
    }
  })
  await createAuditLog({ entityType: "Agent", entityId: agent.id, action: "create", payload: parsed.data })
  return ok(agent, { status: 201 })
}
