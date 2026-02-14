"use client"

import { useCallback, useEffect, useState } from "react"
import type { TemplateData, TemplateFileNode, ViewerTab } from "../_lib/types"
import { parseFileTree } from "../_lib/helpers"

interface UseTemplateDetailReturn {
  template: TemplateData | null
  isLoading: boolean
  error: string | null
  // File tree
  treeNodes: TemplateFileNode[]
  expandedPaths: Set<string>
  toggleFolder: (path: string) => void
  expandAll: () => void
  collapseAll: () => void
  // Selection
  selectedFile: TemplateFileNode | null
  selectedPath: string | null
  selectFile: (node: TemplateFileNode) => void
  // Viewer
  activeTab: ViewerTab
  setActiveTab: (tab: ViewerTab) => void
  fileContent: string | null
  isLoadingFile: boolean
  // Sync
  isSyncing: boolean
  handleSync: () => Promise<void>
}

function collectAllFolderPaths(nodes: TemplateFileNode[], result: string[] = []): string[] {
  for (const node of nodes) {
    if (node.type === "folder") {
      result.push(node.path)
      if (node.children) collectAllFolderPaths(node.children, result)
    }
  }
  return result
}

export function useTemplateDetail(templateId: string): UseTemplateDetailReturn {
  const [template, setTemplate] = useState<TemplateData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [treeNodes, setTreeNodes] = useState<TemplateFileNode[]>([])
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const [selectedFile, setSelectedFile] = useState<TemplateFileNode | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ViewerTab>("preview")
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [isLoadingFile, setIsLoadingFile] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  // Fetch template
  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/templates/${templateId}`)
      .then((res) => res.json())
      .then((payload) => {
        const data = payload.data
        setTemplate(data)
        const tree = parseFileTree(data?.fileTreeSnapshot)
        setTreeNodes(tree)
        // Auto-expand top-level folders
        const topPaths = tree.filter((n) => n.type === "folder").map((n) => n.path)
        setExpandedPaths(new Set(topPaths))
      })
      .catch(() => setError("Template konnte nicht geladen werden."))
      .finally(() => setIsLoading(false))
  }, [templateId])

  // Toggle folder
  const toggleFolder = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }, [])

  // Expand all
  const expandAllFn = useCallback(() => {
    const all = collectAllFolderPaths(treeNodes)
    setExpandedPaths(new Set(all))
  }, [treeNodes])

  // Collapse all
  const collapseAllFn = useCallback(() => {
    setExpandedPaths(new Set())
  }, [])

  // Select file
  const selectFile = useCallback(
    (node: TemplateFileNode) => {
      if (node.type === "folder") {
        toggleFolder(node.path)
        return
      }
      setSelectedFile(node)
      setSelectedPath(node.path)
      setActiveTab("code")

      // Fetch file content
      setIsLoadingFile(true)
      fetch(`/api/templates/${templateId}/file?path=${encodeURIComponent(node.path)}`)
        .then((res) => res.json())
        .then((payload) => setFileContent(payload.data?.content ?? null))
        .catch(() => setFileContent("// Datei konnte nicht geladen werden"))
        .finally(() => setIsLoadingFile(false))
    },
    [templateId, toggleFolder]
  )

  // Sync
  const handleSync = useCallback(async () => {
    setIsSyncing(true)
    try {
      const res = await fetch(`/api/templates/${templateId}/sync`, { method: "POST" })
      const payload = await res.json()
      if (payload.data) {
        setTemplate(payload.data)
        const tree = parseFileTree(payload.data.fileTreeSnapshot)
        setTreeNodes(tree)
      }
    } catch {
      // ignore
    } finally {
      setIsSyncing(false)
    }
  }, [templateId])

  return {
    template,
    isLoading,
    error,
    treeNodes,
    expandedPaths,
    toggleFolder,
    expandAll: expandAllFn,
    collapseAll: collapseAllFn,
    selectedFile,
    selectedPath,
    selectFile,
    activeTab,
    setActiveTab,
    fileContent,
    isLoadingFile,
    isSyncing,
    handleSync,
  }
}
