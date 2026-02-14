import { prisma } from "@/lib/prisma"
import { designSchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

function generateDedupeKey(
  sourceType: string,
  sourceUrl?: string | null,
  dribbbleId?: string | null
): string | null {
  if (sourceType === "dribbble" && dribbbleId) return `dribbble:${dribbbleId}`
  if (sourceType === "web" && sourceUrl) {
    const normalized = sourceUrl.toLowerCase().replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")
    return `web:${normalized}`
  }
  return null
}

export async function GET() {
  const designs = await prisma.design.findMany({ orderBy: { createdAt: "desc" } })
  return ok(designs)
}

export async function POST(request: Request) {
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = designSchema.safeParse(body)
  if (!parsed.success) return fail("Ungültige Design-Daten", 400, parsed.error.flatten())

  const data = parsed.data
  const dedupeKey = generateDedupeKey(data.sourceType, data.sourceUrl, data.dribbbleId)

  // Dedupe check
  if (dedupeKey) {
    const existing = await prisma.design.findUnique({ where: { dedupeKey } })
    if (existing) {
      return fail("Design bereits vorhanden", 409, { existingId: existing.id })
    }
  }

  const design = await prisma.design.create({
    data: {
      name: data.name,
      description: data.description || null,
      sourceType: data.sourceType,
      sourceUrl: data.sourceUrl || null,
      dribbbleId: data.dribbbleId || null,
      dribbbleUser: data.dribbbleUser || null,
      category: data.category || null,
      industry: data.industry || null,
      images: data.images ? JSON.stringify(data.images) : null,
      coverImageUrl: data.coverImageUrl || null,
      screenshotUrl: data.screenshotUrl || null,
      status: data.status,
      dedupeKey,
      tags: JSON.stringify(data.tags),
      notes: data.notes || null,
      collectionIds: data.collectionIds.length > 0 ? JSON.stringify(data.collectionIds) : null,
    },
  })

  await createAuditLog({
    entityType: "Design",
    entityId: design.id,
    action: "create",
    payload: data,
  })

  return ok(design, { status: 201 })
}
