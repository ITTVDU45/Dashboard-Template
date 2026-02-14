import { prisma } from "@/lib/prisma"
import { ok, fail } from "@/lib/api-helpers"
import { createAuditLog } from "@/lib/audit"

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const design = await prisma.design.findUnique({ where: { id } })
  if (!design) return fail("Design not found", 404)

  const blueprint = {
    sections: ["Hero", "Trust", "Benefits", "Pricing", "FAQ"],
    styleHints: ["minimal", "high-contrast", "soft-corners"],
    generatedAt: new Date().toISOString()
  }

  const updated = await prisma.design.update({
    where: { id },
    data: { blueprint: JSON.stringify(blueprint) }
  })

  await createAuditLog({
    entityType: "Design",
    entityId: id,
    action: "update",
    payload: { analyze: true }
  })

  return ok(updated)
}
