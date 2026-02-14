import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/common/stat-card"
import { PageHeader } from "@/components/common/page-header"
import { StatusBadge } from "@/components/common/status-badge"
import { EmptyState } from "@/components/common/empty-state"
import { Workflow } from "lucide-react"

export default async function OverviewPage() {
  const [companies, projects, templates, designs, recentJobs, jobsLast7d] = await Promise.all([
    prisma.company.count(),
    prisma.project.count(),
    prisma.template.count(),
    prisma.design.count(),
    prisma.job.findMany({
      include: { project: true },
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.job.count({
      where: { createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) } }
    })
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Übersicht"
        description="KPIs, letzte Jobs und Schnellstart für neue Landingpage-Workflows"
        ctaLabel="Landingpage-Workflow starten"
        ctaHref="/workflows/new"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Unternehmen" value={companies} />
        <StatCard title="Projekte" value={projects} />
        <StatCard title="Jobs (7 Tage)" value={jobsLast7d} />
        <StatCard title="Templates" value={templates} />
        <StatCard title="Designs" value={designs} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Letzte Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentJobs.length === 0 ? (
              <EmptyState
                icon={Workflow}
                title="Noch keine Jobs vorhanden"
                description="Starte den ersten Landingpage-Workflow, um hier Status und Historie zu sehen."
                action={{ label: "Ersten Job starten", href: "/workflows/new" }}
                className="py-10"
              />
            ) : (
              recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/workflows/${job.id}`}
                  className="flex items-center justify-between rounded-xl border p-3.5 transition-colors hover:bg-muted/40"
                >
                  <div>
                    <p className="font-medium">{job.project.name}</p>
                    <p className="text-xs text-muted-foreground">{job.id}</p>
                  </div>
                  <StatusBadge status={job.status as "queued" | "running" | "needs_review" | "done" | "failed"} />
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schnellstart</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>1) Unternehmen anlegen</p>
            <p>2) Projekt erstellen</p>
            <p>3) Template + Design auswählen</p>
            <p>4) Workflow starten und Job ausführen</p>
            <Button asChild className="w-full">
              <Link href="/workflows/new">Jetzt starten</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
