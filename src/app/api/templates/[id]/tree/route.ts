import { prisma } from "@/lib/prisma"
import { fail, ok } from "@/lib/api-helpers"

/**
 * GET /api/templates/:id/tree
 * Returns the fileTreeSnapshot for a template.
 */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const template = await prisma.template.findUnique({
    where: { id },
    select: { fileTreeSnapshot: true },
  })
  if (!template) return fail("Template not found", 404)

  let tree: unknown[] = []
  if (template.fileTreeSnapshot) {
    try {
      tree = JSON.parse(template.fileTreeSnapshot)
    } catch {
      tree = []
    }
  }

  return ok(tree)
}
