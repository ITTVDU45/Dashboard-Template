import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { fail, ok } from "@/lib/api-helpers"

// POST /api/import-jobs/:id — Simuliert Job-Ausführung (MVP)
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = await prisma.importJob.findUnique({ where: { id } })
  if (!job) return fail("Import-Job nicht gefunden", 404)
  if (job.status !== "queued") return fail("Job ist nicht in der Warteschlange", 400)

  // Setze auf "running"
  await prisma.importJob.update({ where: { id }, data: { status: "running" } })

  // Simuliere Verarbeitung
  const inputData = job.inputData ? JSON.parse(job.inputData) : {}
  let resultDesignId: string | null = null

  try {
    if (job.type === "web_crawl") {
      // Erstelle ein Design mit Placeholder-Daten
      const design = await prisma.design.create({
        data: {
          name: `Import: ${inputData.url || "Web"}`,
          sourceType: "web",
          sourceUrl: inputData.url || null,
          status: "saved",
          tags: JSON.stringify(["importiert", "web"]),
          coverImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        },
      })
      resultDesignId = design.id
    } else if (job.type === "dribbble_sync") {
      const shotId = inputData.shotId || inputData.url?.match(/shots\/(\d+)/)?.[1] || null
      const design = await prisma.design.create({
        data: {
          name: `Dribbble Shot ${shotId || "Import"}`,
          sourceType: "dribbble",
          sourceUrl: inputData.url || null,
          dribbbleId: shotId,
          dribbbleUser: "designer",
          status: "saved",
          tags: JSON.stringify(["importiert", "dribbble"]),
          coverImageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80",
          category: "hero",
        },
      })
      resultDesignId = design.id
    }

    await prisma.importJob.update({
      where: { id },
      data: {
        status: "done",
        resultDesignId,
        completedAt: new Date(),
      },
    })

    await createAuditLog({ entityType: "ImportJob", entityId: id, action: "update", payload: { status: "done", resultDesignId } })
    const updated = await prisma.importJob.findUnique({ where: { id } })
    return ok(updated)
  } catch (err) {
    await prisma.importJob.update({
      where: { id },
      data: {
        status: "error",
        errorMessage: err instanceof Error ? err.message : "Unbekannter Fehler",
      },
    })
    return fail("Job-Ausführung fehlgeschlagen", 500)
  }
}
