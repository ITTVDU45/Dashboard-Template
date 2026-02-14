"use client"

import { FolderOpen } from "lucide-react"
import type { FileTreeProps } from "../_lib/types"
import { FileTreeNode } from "./file-tree-node"

export function FileTree({
  nodes,
  selectedId,
  onToggle,
  onSelect,
  isLoading = false,
}: FileTreeProps) {
  // ── Loading Skeletons ──
  if (isLoading) {
    return (
      <div className="space-y-1 p-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-2 py-1.5"
            style={{ paddingLeft: `${(i % 3) * 16 + 8}px` }}
          >
            <div className="h-4 w-4 animate-pulse rounded bg-muted" />
            <div
              className="h-3.5 animate-pulse rounded bg-muted"
              style={{ width: `${60 + Math.random() * 80}px` }}
            />
          </div>
        ))}
      </div>
    )
  }

  // ── Empty State ──
  if (nodes.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <FolderOpen className="h-10 w-10 text-muted-foreground/30" />
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          Keine Dateien vorhanden
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Assets werden hier als Ordnerstruktur angezeigt
        </p>
      </div>
    )
  }

  // ── Tree ──
  return (
    <div className="h-full overflow-y-auto p-2" role="tree" aria-label="Datei-Explorer">
      {nodes.map((node) => (
        <FileTreeNode
          key={node.id}
          node={node}
          selectedId={selectedId}
          onToggle={onToggle}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
