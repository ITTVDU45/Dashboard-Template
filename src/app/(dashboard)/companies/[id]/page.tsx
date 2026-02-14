import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/common/page-header"
import { CompanyDetailView } from "@/app/(dashboard)/companies/_components/company-detail-view"

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      projects: { select: { id: true, name: true } },
      contacts: { orderBy: { createdAt: "desc" } },
      services: { orderBy: { createdAt: "desc" } },
    },
  })
  if (!company) notFound()

  const jobs = await prisma.job.findMany({
    where: { project: { companyId: id } },
    include: { project: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title={company.name}
        description="Unternehmensdetails, KI-Analyse und zentrale Wissensbasis"
        ctaLabel="Unternehmen bearbeiten"
        ctaHref={`/companies/${company.id}/edit`}
      />
      <CompanyDetailView company={{ ...company, jobs }} />
    </div>
  )
}
