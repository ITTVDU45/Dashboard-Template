import { prisma } from "@/lib/prisma"
import { templateSchema } from "@/lib/validations"
import { createAuditLog } from "@/lib/audit"
import { fail, ok, parseBody } from "@/lib/api-helpers"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const template = await prisma.template.findUnique({ where: { id } })
  if (!template) return fail("Template not found", 404)
  return ok(template)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await parseBody<unknown>(request).catch(() => null)
  const parsed = templateSchema.safeParse(body)
  if (!parsed.success) return fail("Invalid template payload", 400, parsed.error.flatten())

  const template = await prisma.template.update({
    where: { id },
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
    },
  })

  await createAuditLog({ entityType: "Template", entityId: id, action: "update", payload: parsed.data })
  return ok(template)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await parseBody<Record<string, unknown>>(request).catch(() => null)
  if (!body) return fail("Invalid JSON body", 400)

  // Partial update - only update provided fields
  const allowedFields = [
    "name", "slug", "description", "type", "category", "framework", "uiStack",
    "tags", "layoutCode", "placeholdersSchema", "previewImageUrl", "sourceMode",
    "repoFullName", "defaultBranch", "templateRootPath", "readmePath", "entryFile",
    "syncStatus", "lastSyncAt", "lastCommitSha", "syncErrorMessage", "fileTreeSnapshot",
    "usesCount", "lastUsedAt",
  ]

  const data: Record<string, unknown> = {}
  for (const key of allowedFields) {
    if (key in body) {
      if (key === "tags" && Array.isArray(body[key])) {
        data[key] = JSON.stringify(body[key])
      } else if (key === "placeholdersSchema" && typeof body[key] === "object") {
        data[key] = JSON.stringify(body[key])
      } else {
        data[key] = body[key]
      }
    }
  }

  const template = await prisma.template.update({ where: { id }, data })
  await createAuditLog({ entityType: "Template", entityId: id, action: "update", payload: body })
  return ok(template)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.template.delete({ where: { id } })
  await createAuditLog({ entityType: "Template", entityId: id, action: "delete" })
  return ok({ deleted: true })
}
