import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { CompanyForm } from "@/components/forms/company-form"

export default function NewCompanyPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Neues Unternehmen" description="Lege einen neuen Kunden an." />
      <Card>
        <CardContent className="pt-6">
          <CompanyForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}
