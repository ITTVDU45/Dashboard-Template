"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/common/page-header"
import { FileExplorer } from "./_components/file-explorer"
import type { AssetData } from "./_lib/types"

export default function AssetsPage() {
  const [assets, setAssets] = useState<AssetData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/assets")
      .then((res) => res.json())
      .then((payload) => setAssets(payload.data ?? []))
      .catch(() => setAssets([]))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assets"
        description="Alle Dateien und Assets projekt- und company-übergreifend als Ordnerstruktur"
      />

      {isLoading ? (
        <div className="flex h-[calc(100vh-13rem)] items-center justify-center rounded-xl border bg-background">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-3 text-sm text-muted-foreground">Lade Assets...</p>
          </div>
        </div>
      ) : (
        <FileExplorer assets={assets} groupByProject={false} />
      )}
    </div>
  )
}
