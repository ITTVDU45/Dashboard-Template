"use client"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FileTreeNodeProps } from "../_lib/types"
import {
  FILE_TYPE_ICONS,
  FOLDER_ICON_CLOSED,
  FOLDER_ICON_OPEN,
} from "../_lib/constants"

export function FileTreeNode({
  node,
  selectedId,
  onToggle,
  onSelect,
}: FileTreeNodeProps) {
  const isFolder = node.type === "folder"
  const isSelected = selectedId === node.id
  const isExpanded = node.isExpanded ?? false

  // Choose the right icon
  const FileIcon = isFolder
    ? isExpanded
      ? FOLDER_ICON_OPEN
      : FOLDER_ICON_CLOSED
    : FILE_TYPE_ICONS[node.asset?.type ?? "default"] ?? FILE_TYPE_ICONS.default

  const handleClick = () => {
    if (isFolder) {
      onToggle(node.id)
    } else {
      onSelect(node)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
    // Arrow right: expand folder
    if (e.key === "ArrowRight" && isFolder && !isExpanded) {
      e.preventDefault()
      onToggle(node.id)
    }
    // Arrow left: collapse folder
    if (e.key === "ArrowLeft" && isFolder && isExpanded) {
      e.preventDefault()
      onToggle(node.id)
    }
  }

  return (
    <div role="treeitem" aria-expanded={isFolder ? isExpanded : undefined}>
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "group flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-sm transition-colors",
          "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          isSelected && "bg-primary/10 text-primary font-medium",
          !isSelected && "text-foreground/80"
        )}
        style={{ paddingLeft: `${node.level * 16 + 4}px` }}
        aria-label={
          isFolder
            ? `Ordner ${node.name}${node.fileCount ? ` (${node.fileCount} Dateien)` : ""}`
            : `Datei ${node.name}`
        }
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
            isFolder
              ? "text-primary/70"
              : "text-muted-foreground group-hover:text-foreground/70"
          )}
        />

        {/* Name */}
        <span className="truncate">{node.name}</span>

        {/* File count badge for folders */}
        {isFolder && node.fileCount != null && node.fileCount > 0 && (
          <span className="ml-auto shrink-0 text-[10px] tabular-nums text-muted-foreground/60">
            {node.fileCount}
          </span>
        )}
      </button>

      {/* Children (animated collapse) */}
      {isFolder && isExpanded && node.children && node.children.length > 0 && (
        <div role="group" className="tree-children">
          {node.children.map((child) => (
            <FileTreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}
