"use client"

import {
  ChevronsDownUp,
  ChevronsUpDown,
  File as FileIcon,
  Folder,
} from "lucide-react"
import type { FileExplorerProps } from "../_lib/types"
import { useFileTree } from "../_hooks/use-file-tree"
import { FileTree } from "./file-tree"
import { FilePreview } from "./file-preview"

export function FileExplorer({
  assets,
  groupByProject = false,
}: FileExplorerProps) {
  const {
    treeNodes,
    selectedId,
    selectedAsset,
    handleToggle,
    handleSelect,
    handleExpandAll,
    handleCollapseAll,
    totalFiles,
    totalFolders,
  } = useFileTree(assets, groupByProject)

  const isLoading = false // Could be passed as prop if needed

  return (
    <div className="flex h-[calc(100vh-13rem)] overflow-hidden rounded-xl border bg-background shadow-sm">
      {/* ── Left Panel: Tree ── */}
      <div className="flex w-72 shrink-0 flex-col border-r bg-surface/30 lg:w-80">
        {/* Tree Header */}
        <div className="flex shrink-0 items-center justify-between border-b px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-primary/70" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Dateien
            </h3>
          </div>

          {/* Stats + Actions */}
          <div className="flex items-center gap-1">
            <span className="mr-1 text-[10px] tabular-nums text-muted-foreground/50">
              {totalFolders > 0 && (
                <span>{totalFolders} Ordner</span>
              )}
              {totalFolders > 0 && totalFiles > 0 && " · "}
              {totalFiles > 0 && (
                <span>{totalFiles} {totalFiles === 1 ? "Datei" : "Dateien"}</span>
              )}
            </span>

            <button
              type="button"
              onClick={handleExpandAll}
              className="rounded p-1 text-muted-foreground/60 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Alle Ordner aufklappen"
              title="Alle aufklappen"
            >
              <ChevronsUpDown className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={handleCollapseAll}
              className="rounded p-1 text-muted-foreground/60 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Alle Ordner zuklappen"
              title="Alle zuklappen"
            >
              <ChevronsDownUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Tree Content */}
        <div className="flex-1 overflow-hidden">
          <FileTree
            nodes={treeNodes}
            selectedId={selectedId}
            onToggle={handleToggle}
            onSelect={handleSelect}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* ── Right Panel: Preview ── */}
      <div className="flex-1 overflow-hidden bg-background">
        <FilePreview asset={selectedAsset} />
      </div>
    </div>
  )
}
