"use client"

import { use, useCallback, useState } from "react"
import { useTemplateDetail } from "../_hooks/use-template-detail"
import { TemplateDetailHeader } from "../_components/template-detail-header"
import { TemplateRepoTree } from "../_components/template-repo-tree"
import { TemplateFileViewer } from "../_components/template-file-viewer"

export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const {
    template,
    isLoading,
    error,
    treeNodes,
    expandedPaths,
    toggleFolder,
    expandAll,
    collapseAll,
    selectedFile,
    selectedPath,
    selectFile,
    activeTab,
    setActiveTab,
    fileContent,
    isLoadingFile,
    isSyncing,
    handleSync,
  } = useTemplateDetail(id)

  // Phase 2: Local editor save
  const [isSaving, setIsSaving] = useState(false)
  const handleSaveCode = useCallback(
    async (code: string) => {
      if (!template) return
      setIsSaving(true)
      try {
        await fetch(`/api/templates/${template.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ layoutCode: code }),
        })
      } catch {
        // ignore
      } finally {
        setIsSaving(false)
      }
    },
    [template]
  )

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Template wird geladen...</p>
        </div>
      </div>
    )
  }

  // ── Error ──
  if (error || !template) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-destructive">{error || "Template nicht gefunden."}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with badges & actions */}
      <TemplateDetailHeader
        template={template}
        isSyncing={isSyncing}
        onSync={handleSync}
      />

      {/* Split View: Tree + Viewer */}
      <div className="flex h-[calc(100vh-16rem)] overflow-hidden rounded-xl border bg-background shadow-sm">
        {/* Left: Repo Tree */}
        <div className="w-72 shrink-0 border-r bg-surface/30 lg:w-80">
          <TemplateRepoTree
            nodes={treeNodes}
            expanded={expandedPaths}
            selectedPath={selectedPath}
            onSelect={selectFile}
            onToggle={toggleFolder}
            onExpandAll={expandAll}
            onCollapseAll={collapseAll}
          />
        </div>

        {/* Right: Viewer */}
        <div className="flex-1 overflow-hidden">
          <TemplateFileViewer
            template={template}
            selectedFile={selectedFile}
            selectedPath={selectedPath}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            fileContent={fileContent}
            isLoadingFile={isLoadingFile}
            onSaveCode={template.sourceMode === "local" ? handleSaveCode : undefined}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  )
}
