"use client"

import type { AssetData } from "../_lib/types"
import { FileExplorer } from "./file-explorer"

interface ProjectFileExplorerProps {
  assets: AssetData[]
}

/**
 * Thin client wrapper so Server Components can pass serialized asset data
 * to the FileExplorer client component.
 */
export function ProjectFileExplorer({ assets }: ProjectFileExplorerProps) {
  if (assets.length === 0) {
    return (
      <div className="rounded-xl border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Noch keine Assets für dieses Projekt vorhanden.
        </p>
      </div>
    )
  }

  return <FileExplorer assets={assets} groupByProject={true} />
}
