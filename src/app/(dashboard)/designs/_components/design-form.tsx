"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { designSchema } from "@/lib/validations"
import { TagInput } from "@/components/common/tag-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CATEGORY_LABELS, INDUSTRY_LABELS, SOURCE_LABELS } from "../_lib/constants"

interface DesignFormProps {
  mode: "create" | "edit"
  designId?: string
  initialValues?: {
    name?: string
    description?: string
    sourceType?: string
    sourceUrl?: string
    dribbbleId?: string
    dribbbleUser?: string
    category?: string
    industry?: string
    coverImageUrl?: string
    screenshotUrl?: string
    status?: string
    tags?: string[]
    notes?: string
  }
}

export function DesignForm({ mode, designId, initialValues }: DesignFormProps) {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>(initialValues?.tags || [])
  const [sourceType, setSourceType] = useState(initialValues?.sourceType || "web")
  const [category, setCategory] = useState(initialValues?.category || "")
  const [industry, setIndustry] = useState(initialValues?.industry || "")
  const [status, setStatus] = useState(initialValues?.status || "saved")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    const form = new FormData(event.currentTarget)
    const payload = {
      name: String(form.get("name") || ""),
      description: String(form.get("description") || "") || undefined,
      sourceType,
      sourceUrl: String(form.get("sourceUrl") || "") || undefined,
      dribbbleId: String(form.get("dribbbleId") || "") || undefined,
      dribbbleUser: String(form.get("dribbbleUser") || "") || undefined,
      category: category || undefined,
      industry: industry || undefined,
      coverImageUrl: String(form.get("coverImageUrl") || "") || undefined,
      screenshotUrl: String(form.get("screenshotUrl") || "") || undefined,
      status,
      tags,
      notes: String(form.get("notes") || "") || undefined,
    }

    const validated = designSchema.safeParse(payload)
    if (!validated.success) {
      setError(z.prettifyError(validated.error))
      setIsLoading(false)
      return
    }

    const url = mode === "create" ? "/api/designs" : `/api/designs/${designId}`
    const method = mode === "create" ? "POST" : "PUT"
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated.data),
    })

    setIsLoading(false)
    if (!response.ok) {
      const data = await response.json().catch(() => null)
      setError(data?.error || "Speichern fehlgeschlagen.")
      return
    }

    router.push("/designs")
    router.refresh()
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Basic Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" required defaultValue={initialValues?.name || ""} />
        </div>
        <div className="space-y-2">
          <Label>Quelltyp</Label>
          <Select value={sourceType} onValueChange={setSourceType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beschreibung</Label>
        <Textarea id="description" name="description" defaultValue={initialValues?.description || ""} rows={2} />
      </div>

      {/* Source fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sourceUrl">Quell-URL</Label>
          <Input id="sourceUrl" name="sourceUrl" defaultValue={initialValues?.sourceUrl || ""} placeholder="https://..." />
        </div>
        {sourceType === "dribbble" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="dribbbleId">Dribbble Shot-ID</Label>
              <Input id="dribbbleId" name="dribbbleId" defaultValue={initialValues?.dribbbleId || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dribbbleUser">Dribbble Autor</Label>
              <Input id="dribbbleUser" name="dribbbleUser" defaultValue={initialValues?.dribbbleUser || ""} />
            </div>
          </>
        )}
      </div>

      {/* Images */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="coverImageUrl">Cover-Bild-URL</Label>
          <Input id="coverImageUrl" name="coverImageUrl" defaultValue={initialValues?.coverImageUrl || ""} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="screenshotUrl">Screenshot-URL</Label>
          <Input id="screenshotUrl" name="screenshotUrl" defaultValue={initialValues?.screenshotUrl || ""} placeholder="https://..." />
        </div>
      </div>

      {/* Categorization */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Kategorie</Label>
          <Select value={category || "none"} onValueChange={(v) => setCategory(v === "none" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Kategorie wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Keine Kategorie</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Branche</Label>
          <Select value={industry || "none"} onValueChange={(v) => setIndustry(v === "none" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Branche wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Keine Branche</SelectItem>
              {Object.entries(INDUSTRY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="saved">Gespeichert</SelectItem>
              <SelectItem value="archived">Archiviert</SelectItem>
              <SelectItem value="candidate">Template-Kandidat</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <TagInput value={tags} onChange={setTags} />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notizen</Label>
        <Textarea id="notes" name="notes" defaultValue={initialValues?.notes || ""} rows={3} />
      </div>

      {/* Error */}
      {error && (
        <pre className="whitespace-pre-wrap rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">{error}</pre>
      )}

      <Button disabled={isLoading} type="submit">
        {isLoading ? "Speichern..." : mode === "create" ? "Design erstellen" : "Design speichern"}
      </Button>
    </form>
  )
}
