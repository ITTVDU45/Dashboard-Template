import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { parseJsonArray } from "@/lib/serializers"
import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/common/status-badge"

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await prisma.company.findUnique({
    where: { id },
    include: { projects: { include: { jobs: true } } }
  })
  if (!company) notFound()

  const jobs = await prisma.job.findMany({
    where: { project: { companyId: id } },
    include: { project: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title={company.name}
        description="Unternehmensdetails mit Projekten, Jobs und Einstellungen"
        ctaLabel="Unternehmen bearbeiten"
        ctaHref={`/companies/${company.id}/edit`}
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="projects">Projekte</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="grid gap-3 pt-6 md:grid-cols-2">
              <p><span className="text-muted-foreground">Website:</span> {company.website || "-"}</p>
              <p><span className="text-muted-foreground">Branche:</span> {company.industry || "-"}</p>
              <p><span className="text-muted-foreground">Markenton:</span> {company.brandTone || "-"}</p>
              <p><span className="text-muted-foreground">Farben:</span> {parseJsonArray(company.colors).join(", ") || "-"}</p>
              <p className="md:col-span-2"><span className="text-muted-foreground">Notizen:</span> {company.notes || "-"}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader><CardTitle>Projekte</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {company.projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="block rounded-lg border p-3 hover:bg-muted/40">
                  {project.name}
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader><CardTitle>Jobs</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {jobs.map((job) => (
                <Link key={job.id} href={`/workflows/${job.id}`} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40">
                  <span>{job.project.name}</span>
                  <StatusBadge status={job.status as "queued" | "running" | "needs_review" | "done" | "failed"} />
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              MVP: Einstellungen liegen aktuell direkt in den Unternehmensfeldern (Branding/Notizen).
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
