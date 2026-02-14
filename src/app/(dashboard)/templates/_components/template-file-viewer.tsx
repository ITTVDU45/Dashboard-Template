"use client"

import { useState } from "react"
import { File, Copy, Check, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemplateBreadcrumb } from "./template-breadcrumb"
import { TemplateMetaPanel } from "./template-meta-panel"
import { TemplatePreviewTab } from "./template-preview-tab"
import type { TemplateData, TemplateFileNode, ViewerTab } from "../_lib/types"
import { getFileExtension, relativeTime } from "../_lib/helpers"
import { FILE_EXTENSION_LANGUAGES, SYNC_STATUS_CONFIG } from "../_lib/constants"

interface TemplateFileViewerProps {
  template: TemplateData
  selectedFile: TemplateFileNode | null
  selectedPath: string | null
  activeTab: ViewerTab
  onTabChange: (tab: ViewerTab) => void
  fileContent: string | null
  isLoadingFile: boolean
  /** For local editor (Phase 2) */
  onSaveCode?: (code: string) => void
  isSaving?: boolean
}

// ─── Copy Button ─────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {copied ? <Check className="h-3 w-3 text-accent-success" /> : <Copy className="h-3 w-3" />}
      {copied ? "Kopiert" : "Kopieren"}
    </button>
  )
}

// ─── Code Viewer ─────────────────────────────────────────────────────────────

function CodeViewer({ content, filename }: { content: string; filename: string }) {
  const ext = getFileExtension(filename)
  const lang = FILE_EXTENSION_LANGUAGES[ext] || ext.toUpperCase() || "Text"

  return (
    <div>
      {/* File header */}
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <File className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">{filename}</span>
          <span className="text-[10px] text-muted-foreground">{lang}</span>
        </div>
        <CopyButton text={content} />
      </div>

      {/* Code */}
      <div className="overflow-auto rounded-b-lg border">
        <pre className="p-4 text-xs leading-relaxed">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  )
}

// ─── README Viewer ───────────────────────────────────────────────────────────

function ReadmeViewer({ content, path }: { content: string | null; path: string }) {
  if (!content) {
    return (
      <div className="rounded-lg border bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Keine README-Datei vorhanden ({path})
        </p>
      </div>
    )
  }

  // Simple markdown rendering: headings, bold, code blocks, links
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none rounded-lg border bg-background p-6">
      <pre className="whitespace-pre-wrap text-sm leading-relaxed">{content}</pre>
    </div>
  )
}

// ─── History Panel ───────────────────────────────────────────────────────────

function HistoryPanel({ template }: { template: TemplateData }) {
  const syncConfig = SYNC_STATUS_CONFIG[template.syncStatus] || SYNC_STATUS_CONFIG.none
  const SyncIcon = syncConfig.icon

  return (
    <div className="space-y-4 p-6">
      <h3 className="text-sm font-semibold text-foreground">Sync-Verlauf</h3>

      <div className="space-y-3">
        <div className="rounded-lg border bg-muted/20 p-4">
          <div className="flex items-center gap-2">
            <SyncIcon className={cn("h-4 w-4", syncConfig.color)} />
            <span className={cn("text-sm font-medium", syncConfig.color)}>
              {syncConfig.label}
            </span>
          </div>

          {template.lastSyncAt && (
            <p className="mt-2 text-xs text-muted-foreground">
              Letzte Synchronisierung: {relativeTime(template.lastSyncAt)}
            </p>
          )}

          {template.lastCommitSha && (
            <p className="mt-1 text-xs text-muted-foreground">
              Letzter Commit:{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-[10px]">
                {template.lastCommitSha.substring(0, 8)}
              </code>
            </p>
          )}

          {template.syncErrorMessage && (
            <p className="mt-2 text-xs text-destructive">
              Fehler: {template.syncErrorMessage}
            </p>
          )}
        </div>

        {template.sourceMode !== "github" && (
          <p className="text-xs text-muted-foreground">
            Sync ist nur für GitHub-Templates verfügbar.
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Editor Panel (Phase 2) ──────────────────────────────────────────────────

function EditorPanel({
  template,
  onSave,
  isSaving,
}: {
  template: TemplateData
  onSave?: (code: string) => void
  isSaving?: boolean
}) {
  const [code, setCode] = useState(template.layoutCode || "")

  if (template.sourceMode === "github") {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-muted-foreground">
          GitHub-Templates sind schreibgeschützt. Bearbeite den Code direkt auf GitHub.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Layout-Code (Lokal)</span>
        {onSave && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => onSave(code)}
            disabled={isSaving}
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? "Speichern..." : "Speichern"}
          </Button>
        )}
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="flex-1 resize-none rounded-lg border bg-background p-4 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
        spellCheck={false}
      />
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function TemplateFileViewer({
  template,
  selectedFile,
  selectedPath,
  activeTab,
  onTabChange,
  fileContent,
  isLoadingFile,
  onSaveCode,
  isSaving,
}: TemplateFileViewerProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Breadcrumb */}
      {selectedPath && (
        <div className="shrink-0 border-b bg-surface/50 px-4 py-2">
          <TemplateBreadcrumb
            path={selectedPath}
            templateName={template.name}
          />
        </div>
      )}

      {/* Tab navigation */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => onTabChange(v as ViewerTab)}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="shrink-0 border-b px-4">
          <TabsList className="h-9 bg-transparent p-0">
            <TabsTrigger value="preview" className="rounded-none border-b-2 border-transparent px-3 py-1.5 text-xs data-[state=active]:border-primary data-[state=active]:shadow-none">
              Vorschau
            </TabsTrigger>
            <TabsTrigger value="readme" className="rounded-none border-b-2 border-transparent px-3 py-1.5 text-xs data-[state=active]:border-primary data-[state=active]:shadow-none">
              README
            </TabsTrigger>
            <TabsTrigger value="code" className="rounded-none border-b-2 border-transparent px-3 py-1.5 text-xs data-[state=active]:border-primary data-[state=active]:shadow-none">
              Code
            </TabsTrigger>
            <TabsTrigger value="meta" className="rounded-none border-b-2 border-transparent px-3 py-1.5 text-xs data-[state=active]:border-primary data-[state=active]:shadow-none">
              Meta
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-none border-b-2 border-transparent px-3 py-1.5 text-xs data-[state=active]:border-primary data-[state=active]:shadow-none">
              Verlauf
            </TabsTrigger>
            {template.sourceMode === "local" && (
              <TabsTrigger value="editor" className="rounded-none border-b-2 border-transparent px-3 py-1.5 text-xs data-[state=active]:border-primary data-[state=active]:shadow-none">
                Editor
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Preview tab */}
          <TabsContent value="preview" className="mt-0 h-full">
            <TemplatePreviewTab template={template} />
          </TabsContent>

          {/* README tab */}
          <TabsContent value="readme" className="mt-0 h-full p-6">
            <ReadmeViewer
              content={fileContent || template.layoutCode}
              path={template.readmePath || "README.md"}
            />
          </TabsContent>

          {/* Code tab */}
          <TabsContent value="code" className="mt-0 h-full p-6">
            {isLoadingFile ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : selectedFile && fileContent ? (
              <CodeViewer content={fileContent} filename={selectedFile.name} />
            ) : template.layoutCode ? (
              <CodeViewer content={template.layoutCode} filename="layout.html" />
            ) : (
              <div className="rounded-lg border bg-muted/20 p-8 text-center">
                <File className="mx-auto h-8 w-8 text-muted-foreground/30" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Wähle eine Datei im Baum links aus, um den Code anzuzeigen
                </p>
              </div>
            )}
          </TabsContent>

          {/* Meta tab */}
          <TabsContent value="meta" className="mt-0 h-full">
            <TemplateMetaPanel template={template} />
          </TabsContent>

          {/* History tab */}
          <TabsContent value="history" className="mt-0 h-full">
            <HistoryPanel template={template} />
          </TabsContent>

          {/* Editor tab (Phase 2) */}
          <TabsContent value="editor" className="mt-0 h-full">
            <EditorPanel
              template={template}
              onSave={onSaveCode}
              isSaving={isSaving}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
