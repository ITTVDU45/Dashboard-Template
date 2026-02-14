"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/common/data-table"
import { PageHeader } from "@/components/common/page-header"
import { Button } from "@/components/ui/button"
import { DeleteRowButton } from "@/components/common/delete-row-button"

interface ProjectRow {
  id: string
  name: string
  slug: string
  status: string
  companyName: string
}

export default function ProjectsPage() {
  const [rows, setRows] = useState<ProjectRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((payload) => {
        const projects = payload.data ?? []
        setRows(
          projects.map((p: { id: string; name: string; slug: string; status: string; company?: { name: string } }) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            status: p.status,
            companyName: p.company?.name ?? "-"
          }))
        )
      })
      .finally(() => setIsLoading(false))
  }, [])

  const columns: Column<ProjectRow>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => <Link className="font-medium text-primary" href={`/projects/${row.id}`}>{row.name}</Link>,
      sortValue: (row) => row.name
    },
    { key: "companyName", header: "Unternehmen", cell: (row) => row.companyName, sortValue: (row) => row.companyName },
    { key: "slug", header: "Slug", cell: (row) => row.slug, sortValue: (row) => row.slug },
    { key: "status", header: "Status", cell: (row) => row.status, sortValue: (row) => row.status },
    {
      key: "actions",
      header: "Aktionen",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline"><Link href={`/projects/${row.id}/edit`}>Bearbeiten</Link></Button>
          <DeleteRowButton endpoint={`/api/projects/${row.id}`} />
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projekte"
        description="Projekte pro Unternehmen inklusive Zielgruppe und CTA verwalten"
        ctaLabel="Projekt hinzufügen"
        ctaHref="/projects/new"
      />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Lade Projekte...</p>
      ) : (
        <DataTable columns={columns} data={rows} searchBy={(row) => `${row.name} ${row.slug} ${row.companyName} ${row.status}`} />
      )}
    </div>
  )
}
