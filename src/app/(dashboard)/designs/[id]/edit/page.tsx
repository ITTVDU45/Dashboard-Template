"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PageHeader } from "@/components/common/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { DesignForm } from "../../_components/design-form"
import type { DesignData } from "../../_lib/types"
import { parseTags } from "../../_lib/helpers"

export default function EditDesignPage() {
  const params = useParams<{ id: string }>()
  const [design, setDesign] = useState<DesignData | null>(null)

  useEffect(() => {
    fetch(`/api/designs/${params.id}`)
      .then((res) => res.json())
      .then((payload) => setDesign(payload.data))
  }, [params.id])

  if (!design) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Design bearbeiten: ${design.name}`}
        description="Quelle, Screenshot, Kategorie und Tags bearbeiten."
      />
      <Card>
        <CardContent className="pt-6">
          <DesignForm
            mode="edit"
            designId={design.id}
            initialValues={{
              name: design.name,
              description: design.description || "",
              sourceType: design.sourceType,
              sourceUrl: design.sourceUrl || "",
              dribbbleId: design.dribbbleId || "",
              dribbbleUser: design.dribbbleUser || "",
              category: design.category || "",
              industry: design.industry || "",
              coverImageUrl: design.coverImageUrl || "",
              screenshotUrl: design.screenshotUrl || "",
              status: design.status,
              tags: parseTags(design.tags),
              notes: design.notes || "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
