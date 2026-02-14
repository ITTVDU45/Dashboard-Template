"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TagInputProps {
  value: string[]
  onChange: (next: string[]) => void
}

export function TagInput({ value, onChange }: TagInputProps) {
  const [draft, setDraft] = useState("")

  const normalized = useMemo(() => value.filter(Boolean), [value])

  function addTag() {
    const nextTag = draft.trim()
    if (!nextTag) return
    if (normalized.includes(nextTag)) return setDraft("")
    onChange([...normalized, nextTag])
    setDraft("")
  }

  function removeTag(tag: string) {
    onChange(normalized.filter((entry) => entry !== tag))
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Tag hinzufuegen"
          onKeyDown={(event) => {
            if (event.key !== "Enter") return
            event.preventDefault()
            addTag()
          }}
        />
        <Button type="button" variant="outline" onClick={addTag}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {normalized.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-2">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} aria-label={`Tag ${tag} entfernen`}>
              ×
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
