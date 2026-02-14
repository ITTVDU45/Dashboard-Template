"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import type { AssetData, FileNode } from "../_lib/types"
import {
  buildFileTree,
  toggleNodeExpanded,
  expandAll,
  collapseAll,
} from "../_lib/helpers"

interface UseFileTreeReturn {
  treeNodes: FileNode[]
  selectedId: string | null
  selectedAsset: AssetData | null
  handleToggle: (nodeId: string) => void
  handleSelect: (node: FileNode) => void
  handleExpandAll: () => void
  handleCollapseAll: () => void
  totalFiles: number
  totalFolders: number
}

function countNodesRecursive(nodes: FileNode[]): { files: number; folders: number } {
  let files = 0
  let folders = 0
  for (const node of nodes) {
    if (node.type === "file") {
      files++
    } else {
      folders++
      if (node.children) {
        const sub = countNodesRecursive(node.children)
        files += sub.files
        folders += sub.folders
      }
    }
  }
  return { files, folders }
}

export function useFileTree(
  assets: AssetData[],
  groupByProject = false
): UseFileTreeReturn {
  const [treeNodes, setTreeNodes] = useState<FileNode[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<AssetData | null>(null)

  // Build tree when assets change
  useEffect(() => {
    const tree = buildFileTree(assets, groupByProject)
    setTreeNodes(tree)
    // Reset selection when assets change
    setSelectedId(null)
    setSelectedAsset(null)
  }, [assets, groupByProject])

  const handleToggle = useCallback((nodeId: string) => {
    setTreeNodes((prev) => toggleNodeExpanded(prev, nodeId))
  }, [])

  const handleSelect = useCallback((node: FileNode) => {
    if (node.type === "file") {
      setSelectedId(node.id)
      setSelectedAsset(node.asset ?? null)
    } else {
      // For folders: toggle expand
      setTreeNodes((prev) => toggleNodeExpanded(prev, node.id))
    }
  }, [])

  const handleExpandAll = useCallback(() => {
    setTreeNodes((prev) => expandAll(prev))
  }, [])

  const handleCollapseAll = useCallback(() => {
    setTreeNodes((prev) => collapseAll(prev))
  }, [])

  const { files: totalFiles, folders: totalFolders } = useMemo(
    () => countNodesRecursive(treeNodes),
    [treeNodes]
  )

  return {
    treeNodes,
    selectedId,
    selectedAsset,
    handleToggle,
    handleSelect,
    handleExpandAll,
    handleCollapseAll,
    totalFiles,
    totalFolders,
  }
}
