"use client"

import { useState } from "react"
import { X, Plus, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { DesignData } from "../_lib/types"
import { parseTags } from "../_lib/helpers"

interface DesignTagPopoverProps {
  design: DesignData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (designId: string, tags: string[]) => Promise<void>
  children?: React.ReactNode
}

export function DesignTagPopover({ design, open, onOpenChange, onSave, children }: DesignTagPopoverProps) {
  const [tags, setTags] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Sync tags when design changes
  function handleOpenChange(isOpen: boolean) {
    if (isOpen && design) {
      setTags(parseTags(design.tags))
      setInput("")
    }
    onOpenChange(isOpen)
  }

  function addTag() {
    const trimmed = input.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed])
    }
    setInput("")
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  async function handleSave() {
    if (!design) return
    setIsSaving(true)
    await onSave(design.id, tags)
    setIsSaving(false)
    onOpenChange(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      {children && <PopoverTrigger asChild>{children}</PopoverTrigger>}
      <PopoverContent className="w-72" align="start">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold">Tags bearbeiten</h4>
          </div>

          {/* Existing tags */}
          <div className="flex flex-wrap gap-1 min-h-[2rem]">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs gap-1">
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {tags.length === 0 && (
              <p className="text-xs text-muted-foreground">Keine Tags vorhanden</p>
            )}
          </div>

          {/* Add tag */}
          <div className="flex gap-1.5">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
              placeholder="Neuen Tag eingeben..."
              className="h-8 text-xs"
            />
            <Button size="sm" variant="outline" className="h-8 px-2" onClick={addTag} disabled={!input.trim()}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Button size="sm" className="w-full" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Speichern..." : "Tags speichern"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
