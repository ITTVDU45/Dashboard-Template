import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { ProjectForm } from "@/components/forms/project-form"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [project, companies] = await Promise.all([
    prisma.project.findUnique({ where: { id } }),
    prisma.company.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })
  ])
  if (!project) notFound()

  return (
    <div className="space-y-6">
      <PageHeader title={`Projekt bearbeiten: ${project.name}`} description="Projektziel und Meta-Daten anpassen." />
      <Card>
        <CardContent className="pt-6">
          <ProjectForm
            mode="edit"
            projectId={project.id}
            companies={companies}
            initialValues={{
              companyId: project.companyId,
              name: project.name,
              slug: project.slug,
              objective: project.objective || "",
              targetAudience: project.targetAudience || "",
              primaryCTA: project.primaryCTA || "",
              status: project.status
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
