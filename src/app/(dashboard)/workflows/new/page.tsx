import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/common/page-header"
import { StartWorkflowWizard } from "@/components/workflows/start-workflow-wizard"

export default async function NewWorkflowPage() {
  const [companies, projects, templates, designs] = await Promise.all([
    prisma.company.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.project.findMany({ select: { id: true, name: true, companyId: true, primaryCTA: true }, orderBy: { name: "asc" } }),
    prisma.template.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.design.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Landingpage-Workflow starten"
        description="6-Schritte-Assistent: Unternehmen > Projekt > Template > Design > Inhalt > Prüfung"
      />
      <StartWorkflowWizard companies={companies} projects={projects} templates={templates} designs={designs} />
    </div>
  )
}
