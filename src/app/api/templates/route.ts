import { prisma } from "@/lib/prisma"
import { templateSchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const search = searchParams.get("search") || ""
  const type = searchParams.get("type") || ""
  const category = searchParams.get("category") || ""
  const framework = searchParams.get("framework") || ""
  const source = searchParams.get("source") || ""
  const sort = searchParams.get("sort") || "updated"

  // Build where clause
  const where: Record<string, unknown> = {}

  if (type) where.type = type
  if (category) where.category = category
  if (framework) where.framework = framework
  if (source) where.sourceMode = source

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { slug: { contains: search } },
      { description: { contains: search } },
      { tags: { contains: search } },
    ]
  }

  // Build orderBy
  let orderBy: Record<string, string> = { updatedAt: "desc" }
  if (sort === "name") orderBy = { name: "asc" }
  if (sort === "uses") orderBy = { usesCount: "desc" }
  if (sort === "created") orderBy = { createdAt: "desc" }

  const templates = await prisma.template.findMany({
    where,
    orderBy,
  })
  return ok(templates)
}

export async function POST(request: Request) {
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = templateSchema.safeParse(body)
  if (!parsed.success) return fail("Invalid template payload", 400, parsed.error.flatten())

  const template = await prisma.template.create({
    data: {
      ...parsed.data,
      tags: JSON.stringify(parsed.data.tags),
      placeholdersSchema: parsed.data.placeholdersSchema
        ? JSON.stringify(parsed.data.placeholdersSchema)
        : null,
      previewImageUrl: parsed.data.previewImageUrl || null,
      repoFullName: parsed.data.repoFullName || null,
      defaultBranch: parsed.data.defaultBranch || null,
      templateRootPath: parsed.data.templateRootPath || null,
      readmePath: parsed.data.readmePath || null,
      entryFile: parsed.data.entryFile || null,
      uiStack: parsed.data.uiStack || null,
      category: parsed.data.category || null,
      syncStatus: parsed.data.sourceMode === "github" ? "out_of_sync" : "none",
    },
  })

  await createAuditLog({
    entityType: "Template",
    entityId: template.id,
    action: "create",
    payload: parsed.data,
  })

  return ok(template, { status: 201 })
}
