"use client"

import {
  ChevronRight,
  Folder,
  FolderOpen,
  File,
  FileCode2,
  FileJson,
  FileText,
  Image,
  ChevronsUpDown,
  ChevronsDownUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { TemplateFileNode } from "../_lib/types"
import { getFileExtension } from "../_lib/helpers"

// ─── File icon by extension ──────────────────────────────────────────────────

function getFileIcon(name: string) {
  const ext = getFileExtension(name)
  switch (ext) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
    case "html":
    case "css":
      return FileCode2
    case "json":
      return FileJson
    case "md":
    case "txt":
      return FileText
    case "png":
    case "jpg":
    case "svg":
    case "gif":
    case "webp":
      return Image
    default:
      return File
  }
}

// ─── Count files recursively ─────────────────────────────────────────────────

function countFiles(node: TemplateFileNode): number {
  if (node.type === "file") return 1
  if (!node.children) return 0
  return node.children.reduce((s, c) => s + countFiles(c), 0)
}

// ─── Tree Node ───────────────────────────────────────────────────────────────

interface TreeNodeProps {
  node: TemplateFileNode
  level: number
  expanded: Set<string>
  selectedPath: string | null
  onSelect: (node: TemplateFileNode) => void
  onToggle: (path: string) => void
}

function TreeNode({ node, level, expanded, selectedPath, onSelect, onToggle }: TreeNodeProps) {
  const isFolder = node.type === "folder"
  const isExpanded = expanded.has(node.path)
  const isSelected = selectedPath === node.path

  const FolderIcon = isExpanded ? FolderOpen : Folder
  const FileIcon = isFolder ? FolderIcon : getFileIcon(node.name)
  const fileCount = isFolder ? countFiles(node) : 0

  return (
    <div role="treeitem" aria-selected={isSelected} aria-expanded={isFolder ? isExpanded : undefined}>
      <button
        type="button"
        onClick={() => {
          if (isFolder) {
            onToggle(node.path)
          } else {
            onSelect(node)
          }
        }}
        className={cn(
          "group flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-sm transition-colors",
          "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          isSelected && "bg-primary/10 text-primary font-medium",
          !isSelected && "text-foreground/80"
        )}
        style={{ paddingLeft: `${level * 16 + 4}px` }}
      >
        {/* Chevron for folders */}
        {isFolder ? (
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
              isExpanded && "rotate-90"
            )}
          />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        {/* Icon */}
        <FileIcon
          className={cn(
            "h-4 w-4 shrink-0",
            isFolder ? "text-primary/70" : "text-muted-foreground group-hover:text-foreground/70"
          )}
        />

        {/* Name */}
        <span className="truncate">{node.name}</span>

        {/* File count for folders */}
        {isFolder && fileCount > 0 && (
          <span className="ml-auto shrink-0 text-[10px] tabular-nums text-muted-foreground/60">
            {fileCount}
          </span>
        )}
      </button>

      {/* Children */}
      {isFolder && isExpanded && node.children && node.children.length > 0 && (
        <div role="group" className="tree-children">
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              level={level + 1}
              expanded={expanded}
              selectedPath={selectedPath}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Repo Tree ──────────────────────────────────────────────────────────

interface TemplateRepoTreeProps {
  nodes: TemplateFileNode[]
  expanded: Set<string>
  selectedPath: string | null
  onSelect: (node: TemplateFileNode) => void
  onToggle: (path: string) => void
  onExpandAll: () => void
  onCollapseAll: () => void
}

export function TemplateRepoTree({
  nodes,
  expanded,
  selectedPath,
  onSelect,
  onToggle,
  onExpandAll,
  onCollapseAll,
}: TemplateRepoTreeProps) {
  // Count totals
  const totalFiles = nodes.reduce((s, n) => s + countFiles(n), 0)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-primary/70" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Dateien
          </h3>
          <span className="text-[10px] tabular-nums text-muted-foreground/50">
            {totalFiles} {totalFiles === 1 ? "Datei" : "Dateien"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onExpandAll}
            className="rounded p-1 text-muted-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
            title="Alle aufklappen"
          >
            <ChevronsUpDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onCollapseAll}
            className="rounded p-1 text-muted-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
            title="Alle zuklappen"
          >
            <ChevronsDownUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2" role="tree" aria-label="Repository-Dateien">
        {nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FolderOpen className="h-8 w-8 text-muted-foreground/30" />
            <p className="mt-2 text-xs text-muted-foreground">
              Keine Dateien vorhanden
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground/60">
              Starte einen Sync, um Dateien zu laden
            </p>
          </div>
        ) : (
          nodes.map((node) => (
            <TreeNode
              key={node.path}
              node={node}
              level={0}
              expanded={expanded}
              selectedPath={selectedPath}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))
        )}
      </div>
    </div>
  )
}
