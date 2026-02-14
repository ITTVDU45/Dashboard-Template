import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { DesignForm } from "../_components/design-form"

export default function NewDesignPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Neues Design" description="Füge eine Inspiration mit Tags, Kategorie und Branche hinzu." />
      <Card>
        <CardContent className="pt-6">
          <DesignForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
