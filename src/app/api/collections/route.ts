import { prisma } from "@/lib/prisma"
import { collectionSchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

export async function GET() {
  const collections = await prisma.collection.findMany({ orderBy: { createdAt: "desc" } })
  return ok(collections)
}

export async function POST(request: Request) {
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = collectionSchema.safeParse(body)
  if (!parsed.success) return fail("Ungültige Collection-Daten", 400, parsed.error.flatten())

  const data = parsed.data
  const collection = await prisma.collection.create({
    data: {
      name: data.name,
      description: data.description || null,
      designIds: data.designIds.length > 0 ? JSON.stringify(data.designIds) : null,
    },
  })

  await createAuditLog({
    entityType: "Collection",
    entityId: collection.id,
    action: "create",
    payload: data,
  })

  return ok(collection, { status: 201 })
}
