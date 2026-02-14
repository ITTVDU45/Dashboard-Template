import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { ProjectForm } from "@/components/forms/project-form"

export default async function NewProjectPage() {
  const [companies, templateCategories] = await Promise.all([
    prisma.company.findMany({
      select: { id: true, name: true, shortPitch: true, targetMarket: true, usp: true, websiteSystem: true, techStack: true },
      orderBy: { name: "asc" },
    }),
    prisma.template.findMany({ select: { category: true }, where: { category: { not: null } } }),
  ])
  const categories = [...new Set((templateCategories.map((t) => t.category).filter(Boolean) as string[]))].sort()

  return (
    <div className="space-y-6">
      <PageHeader title="Neues Projekt" description="Erstelle ein Projekt für ein Unternehmen." />
      <Card>
        <CardContent className="pt-6">
          <ProjectForm mode="create" companies={companies} templateCategories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}
