import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { ProjectForm } from "@/components/forms/project-form"

export default async function NewProjectPage() {
  const companies = await prisma.company.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })

  return (
    <div className="space-y-6">
      <PageHeader title="Neues Projekt" description="Erstelle ein Projekt für ein Unternehmen." />
      <Card>
        <CardContent className="pt-6">
          <ProjectForm mode="create" companies={companies} />
        </CardContent>
      </Card>
    </div>
  )
}
