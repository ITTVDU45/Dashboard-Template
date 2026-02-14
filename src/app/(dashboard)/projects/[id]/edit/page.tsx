import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { ProjectForm } from "@/components/forms/project-form"

function parseJsonArray(value: string | null | undefined): string[] {
  if (value == null || value === "") return []
  try {
    const arr = JSON.parse(value) as unknown
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : []
  } catch {
    return []
  }
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [project, companies, templateCategories] = await Promise.all([
    prisma.project.findUnique({ where: { id } }),
    prisma.company.findMany({
      select: { id: true, name: true, shortPitch: true, targetMarket: true, usp: true, websiteSystem: true, techStack: true },
      orderBy: { name: "asc" },
    }),
    prisma.template.findMany({ select: { category: true }, where: { category: { not: null } } }),
  ])
  if (!project) notFound()

  const categories = [...new Set((templateCategories.map((t) => t.category).filter(Boolean) as string[]))].sort()

  return (
    <div className="space-y-6">
      <PageHeader title={`Projekt bearbeiten: ${project.name}`} description="Projektziel und Meta-Daten anpassen." />
      <Card>
        <CardContent className="pt-6">
          <ProjectForm
            mode="edit"
            projectId={project.id}
            companies={companies}
            templateCategories={categories}
            initialValues={{
              companyId: project.companyId,
              name: project.name,
              slug: project.slug,
              objective: project.objective || "",
              targetAudience: project.targetAudience || "",
              primaryCTA: project.primaryCTA || "",
              status: project.status,
              description: project.description || "",
              owner: project.owner || "",
              startDate: project.startDate ? project.startDate.toISOString().slice(0, 10) : "",
              endDate: project.endDate ? project.endDate.toISOString().slice(0, 10) : "",
              technologies: parseJsonArray(project.technologies),
              contactPerson: project.contactPerson || "",
              workflowAssignmentEnabled: project.workflowAssignmentEnabled ?? true,
              preferredTemplateCategories: parseJsonArray(project.preferredTemplateCategories),
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
