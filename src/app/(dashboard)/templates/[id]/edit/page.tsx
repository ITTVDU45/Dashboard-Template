import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { parseJsonArray } from "@/lib/serializers"
import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { TemplateForm } from "../../_components/template-form"

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const template = await prisma.template.findUnique({ where: { id } })
  if (!template) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Template bearbeiten: ${template.name}`}
        description="Template-Metadaten, Quelle und Code anpassen."
      />
      <Card>
        <CardContent className="pt-6">
          <TemplateForm
            mode="edit"
            templateId={template.id}
            initialValues={{
              name: template.name,
              slug: template.slug,
              description: template.description || "",
              type: template.type,
              category: template.category || "",
              framework: template.framework,
              uiStack: template.uiStack || "",
              tags: parseJsonArray(template.tags),
              layoutCode: template.layoutCode || "",
              placeholdersSchema: template.placeholdersSchema || "{}",
              previewImageUrl: template.previewImageUrl || "",
              sourceMode: template.sourceMode,
              repoFullName: template.repoFullName || "",
              defaultBranch: template.defaultBranch || "main",
              templateRootPath: template.templateRootPath || "",
              readmePath: template.readmePath || "README.md",
              entryFile: template.entryFile || "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
