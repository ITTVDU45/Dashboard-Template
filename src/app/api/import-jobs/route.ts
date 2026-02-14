import { prisma } from "@/lib/prisma"
import { ok } from "@/lib/api-helpers"

export async function GET() {
  const jobs = await prisma.importJob.findMany({ orderBy: { createdAt: "desc" } })
  return ok(jobs)
}
