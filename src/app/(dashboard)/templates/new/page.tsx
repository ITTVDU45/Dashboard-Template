import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { TemplateForm } from "../_components/template-form"

export default function NewTemplatePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Neues Template"
        description="Template aus GitHub importieren oder lokal anlegen."
      />
      <Card>
        <CardContent className="pt-6">
          <TemplateForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
