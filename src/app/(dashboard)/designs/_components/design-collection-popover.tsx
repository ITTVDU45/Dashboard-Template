"use client"

import { useState } from "react"
import { FolderPlus, Check, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { DesignData, CollectionData } from "../_lib/types"
import { parseStringArray } from "../_lib/helpers"

interface DesignCollectionPopoverProps {
  design: DesignData | null
  collections: CollectionData[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggle: (designId: string, collectionId: string, add: boolean) => Promise<void>
  onCreateCollection: (name: string) => Promise<void>
  children?: React.ReactNode
}

export function DesignCollectionPopover({
  design,
  collections,
  open,
  onOpenChange,
  onToggle,
  onCreateCollection,
  children,
}: DesignCollectionPopoverProps) {
  const [newName, setNewName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const designCollectionIds = design ? parseStringArray(design.collectionIds) : []

  async function handleToggle(collectionId: string) {
    if (!design) return
    const isIn = designCollectionIds.includes(collectionId)
    await onToggle(design.id, collectionId, !isIn)
  }

  async function handleCreate() {
    if (!newName.trim()) return
    setIsCreating(true)
    await onCreateCollection(newName.trim())
    setNewName("")
    setIsCreating(false)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      {children && <PopoverTrigger asChild>{children}</PopoverTrigger>}
      <PopoverContent className="w-64" align="start">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FolderPlus className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold">Zu Collection hinzufügen</h4>
          </div>

          {/* Collection list */}
          <div className="max-h-48 space-y-1 overflow-y-auto">
            {collections.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">Noch keine Collections vorhanden.</p>
            ) : (
              collections.map((col) => {
                const isIn = designCollectionIds.includes(col.id)
                return (
                  <button
                    key={col.id}
                    onClick={() => handleToggle(col.id)}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted ${
                      isIn ? "text-primary font-medium" : "text-foreground"
                    }`}
                  >
                    <div className={`flex h-4 w-4 items-center justify-center rounded border ${
                      isIn ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                    }`}>
                      {isIn && <Check className="h-3 w-3" />}
                    </div>
                    <span className="truncate">{col.name}</span>
                  </button>
                )
              })
            )}
          </div>

          {/* Create new collection */}
          <div className="border-t pt-2">
            <p className="text-xs text-muted-foreground mb-1.5">Neue Collection erstellen</p>
            <div className="flex gap-1.5">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleCreate() } }}
                placeholder="Name..."
                className="h-8 text-xs"
              />
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-2"
                onClick={handleCreate}
                disabled={!newName.trim() || isCreating}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
