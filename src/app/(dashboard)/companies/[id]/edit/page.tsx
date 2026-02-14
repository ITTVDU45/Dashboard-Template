import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { parseJsonArray } from "@/lib/serializers"
import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { CompanyForm } from "@/components/forms/company-form"

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await prisma.company.findUnique({ where: { id } })
  if (!company) notFound()

  return (
    <div className="space-y-6">
      <PageHeader title={`Unternehmen bearbeiten: ${company.name}`} description="Stammdaten und Branding ändern." />
      <Card>
        <CardContent className="pt-6">
          <CompanyForm
            mode="edit"
            companyId={company.id}
            initialValues={{
              name: company.name,
              website: company.website || "",
              industry: company.industry || "",
              brandTone: company.brandTone || "",
              colors: parseJsonArray(company.colors),
              logoUrl: company.logoUrl || "",
              notes: company.notes || ""
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
