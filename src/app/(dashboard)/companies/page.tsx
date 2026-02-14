"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/common/data-table"
import { PageHeader } from "@/components/common/page-header"
import { Button } from "@/components/ui/button"
import { DeleteRowButton } from "@/components/common/delete-row-button"

interface CompanyRow {
  id: string
  name: string
  website: string | null
  industry: string | null
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((payload) => setCompanies(payload.data ?? []))
      .finally(() => setIsLoading(false))
  }, [])

  const columns: Column<CompanyRow>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => <Link className="font-medium text-primary" href={`/companies/${row.id}`}>{row.name}</Link>,
      sortValue: (row) => row.name
    },
    {
      key: "industry",
      header: "Branche",
      cell: (row) => row.industry || "-",
      sortValue: (row) => row.industry || ""
    },
    {
      key: "website",
      header: "Website",
      cell: (row) => (row.website ? <a className="text-primary" href={row.website}>{row.website}</a> : "-")
    },
    {
      key: "actions",
      header: "Aktionen",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline"><Link href={`/companies/${row.id}/edit`}>Bearbeiten</Link></Button>
          <DeleteRowButton endpoint={`/api/companies/${row.id}`} />
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unternehmen"
        description="Kunden anlegen, verwalten und mit Projekten verknüpfen"
        ctaLabel="Unternehmen hinzufügen"
        ctaHref="/companies/new"
      />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Lade Unternehmen...</p>
      ) : (
        <DataTable
          columns={columns}
          data={companies}
          searchBy={(row) => `${row.name} ${row.industry || ""} ${row.website || ""}`}
        />
      )}
    </div>
  )
}
