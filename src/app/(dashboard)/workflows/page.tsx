"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/common/data-table"
import { PageHeader } from "@/components/common/page-header"
import { StatusBadge } from "@/components/common/status-badge"
import { Button } from "@/components/ui/button"

interface JobRow {
  id: string
  projectName: string
  status: "queued" | "running" | "needs_review" | "done" | "failed"
}

export default function WorkflowsPage() {
  const [rows, setRows] = useState<JobRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((payload) => {
        const jobs = payload.data ?? []
        setRows(
          jobs.map((j: { id: string; status: string; project?: { name: string } }) => ({
            id: j.id,
            projectName: j.project?.name ?? "-",
            status: j.status as JobRow["status"]
          }))
        )
      })
      .finally(() => setIsLoading(false))
  }, [])

  const columns: Column<JobRow>[] = [
    {
      key: "id",
      header: "Job",
      cell: (row) => <Link href={`/workflows/${row.id}`} className="font-medium text-primary">{row.id}</Link>,
      sortValue: (row) => row.id
    },
    {
      key: "projectName",
      header: "Projekt",
      cell: (row) => row.projectName,
      sortValue: (row) => row.projectName
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
      sortValue: (row) => row.status
    },
    {
      key: "actions",
      header: "Aktionen",
      cell: (row) => (
        <Button asChild size="sm" variant="outline">
          <Link href={`/workflows/${row.id}`}>Details</Link>
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflows / Jobs"
        description="Workflow-Jobs starten, Status beobachten und Logs einsehen"
        ctaLabel="Landingpage-Workflow starten"
        ctaHref="/workflows/new"
      />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Lade Jobs...</p>
      ) : (
        <DataTable columns={columns} data={rows} searchBy={(row) => `${row.id} ${row.projectName} ${row.status}`} />
      )}
    </div>
  )
}
