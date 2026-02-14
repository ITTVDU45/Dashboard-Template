import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/common/status-badge"
import { ProjectFileExplorer } from "../../assets/_components/project-file-explorer"

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: { company: true, jobs: true, assets: true }
  })
  if (!project) notFound()

  const [designs, templates] = await Promise.all([
    prisma.design.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.template.findMany({ orderBy: { createdAt: "desc" }, take: 10 })
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        description="Projektansicht mit Designs, Templates, Jobs, Assets und Einstellungen"
        ctaLabel="Projekt bearbeiten"
        ctaHref={`/projects/${project.id}/edit`}
      />
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="designs">Designs</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="settings">Einstellungen</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card><CardContent className="grid gap-2 pt-6 md:grid-cols-2">
            <p><span className="text-muted-foreground">Unternehmen:</span> {project.company.name}</p>
            <p><span className="text-muted-foreground">Slug:</span> {project.slug}</p>
            <p><span className="text-muted-foreground">Status:</span> {project.status}</p>
            <p><span className="text-muted-foreground">Primärer CTA:</span> {project.primaryCTA || "-"}</p>
            <p className="md:col-span-2"><span className="text-muted-foreground">Zielsetzung:</span> {project.objective || "-"}</p>
            <p className="md:col-span-2"><span className="text-muted-foreground">Zielgruppe:</span> {project.targetAudience || "-"}</p>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="designs">
          <Card><CardHeader><CardTitle>Zugeordnete Designs (MVP)</CardTitle></CardHeader><CardContent className="space-y-2">
            {designs.map((design) => <Link key={design.id} href={`/designs/${design.id}`} className="block rounded border p-3 hover:bg-muted/40">{design.name}</Link>)}
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="templates">
          <Card><CardHeader><CardTitle>Zugeordnete Templates (MVP)</CardTitle></CardHeader><CardContent className="space-y-2">
            {templates.map((template) => <Link key={template.id} href={`/templates/${template.id}`} className="block rounded border p-3 hover:bg-muted/40">{template.name}</Link>)}
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="jobs">
          <Card><CardContent className="space-y-2 pt-6">
            {project.jobs.map((job) => (
              <Link key={job.id} href={`/workflows/${job.id}`} className="flex items-center justify-between rounded border p-3 hover:bg-muted/40">
                <span>{job.id}</span>
                <StatusBadge status={job.status as "queued" | "running" | "needs_review" | "done" | "failed"} />
              </Link>
            ))}
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="assets">
          <ProjectFileExplorer
            assets={project.assets.map((a) => ({
              id: a.id,
              type: a.type,
              storageKey: a.storageKey,
              projectId: a.projectId,
              jobId: a.jobId,
              publicUrl: a.publicUrl,
              meta: a.meta,
              createdAt: a.createdAt.toISOString(),
            }))}
          />
        </TabsContent>
        <TabsContent value="settings">
          <Card><CardContent className="pt-6 text-sm text-muted-foreground">MVP: Verwende das Bearbeitungsformular für alle Projekteinstellungen.</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
