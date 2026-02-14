"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { templateSchema } from "@/lib/validations"
import { TagInput } from "@/components/common/tag-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TYPE_LABELS, FRAMEWORK_LABELS, SECTION_CATEGORIES } from "../_lib/constants"

interface TemplateFormProps {
  mode: "create" | "edit"
  templateId?: string
  initialValues?: {
    name?: string
    slug?: string
    description?: string
    type?: string
    category?: string
    framework?: string
    uiStack?: string
    tags?: string[]
    layoutCode?: string
    placeholdersSchema?: string
    previewImageUrl?: string
    sourceMode?: string
    repoFullName?: string
    defaultBranch?: string
    templateRootPath?: string
    readmePath?: string
    entryFile?: string
  }
}

export function TemplateForm({ mode, templateId, initialValues }: TemplateFormProps) {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>(initialValues?.tags || [])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [type, setType] = useState(initialValues?.type || "section")
  const [sourceMode, setSourceMode] = useState(initialValues?.sourceMode || "local")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    const form = new FormData(event.currentTarget)
    const schemaInput = String(form.get("placeholdersSchema") || "")

    let parsedSchema = undefined
    if (schemaInput.trim()) {
      try {
        parsedSchema = JSON.parse(schemaInput)
      } catch {
        setError("Platzhalter-Schema ist kein gültiges JSON.")
        setIsLoading(false)
        return
      }
    }

    const payload = {
      name: String(form.get("name") || ""),
      slug: String(form.get("slug") || ""),
      description: String(form.get("description") || ""),
      type: String(form.get("type") || "section"),
      category: String(form.get("category") || "") || undefined,
      framework: String(form.get("framework") || "nextjs"),
      uiStack: String(form.get("uiStack") || "") || undefined,
      tags,
      layoutCode: String(form.get("layoutCode") || ""),
      placeholdersSchema: parsedSchema,
      previewImageUrl: String(form.get("previewImageUrl") || ""),
      sourceMode: String(form.get("sourceMode") || "local"),
      repoFullName: String(form.get("repoFullName") || "") || undefined,
      defaultBranch: String(form.get("defaultBranch") || "") || undefined,
      templateRootPath: String(form.get("templateRootPath") || "") || undefined,
      readmePath: String(form.get("readmePath") || "") || undefined,
      entryFile: String(form.get("entryFile") || "") || undefined,
    }

    const validated = templateSchema.safeParse(payload)
    if (!validated.success) {
      setError(z.prettifyError(validated.error))
      setIsLoading(false)
      return
    }

    const url = mode === "create" ? "/api/templates" : `/api/templates/${templateId}`
    const method = mode === "create" ? "POST" : "PUT"
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated.data),
    })

    setIsLoading(false)
    if (!response.ok) {
      setError("Speichern fehlgeschlagen.")
      return
    }

    router.push("/templates")
    router.refresh()
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* ── Basis-Informationen ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground">Basis</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" required defaultValue={initialValues?.name || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" name="slug" required defaultValue={initialValues?.slug || ""} placeholder="z.B. hero-gradient" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Input id="description" name="description" defaultValue={initialValues?.description || ""} />
          </div>
        </div>
      </fieldset>

      {/* ── Typ & Klassifizierung ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground">Klassifizierung</legend>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="type">Typ</Label>
            <select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {Object.entries(TYPE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          {type === "section" && (
            <div className="space-y-2">
              <Label htmlFor="category">Kategorie</Label>
              <select
                id="category"
                name="category"
                defaultValue={initialValues?.category || ""}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">— Keine —</option>
                {SECTION_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="framework">Framework</Label>
            <select
              id="framework"
              name="framework"
              defaultValue={initialValues?.framework || "nextjs"}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {Object.entries(FRAMEWORK_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="uiStack">UI-Stack</Label>
            <Input id="uiStack" name="uiStack" defaultValue={initialValues?.uiStack || ""} placeholder="z.B. tailwind, shadcn" />
          </div>
        </div>
      </fieldset>

      {/* ── Source ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground">Quelle</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sourceMode">Source</Label>
            <select
              id="sourceMode"
              name="sourceMode"
              value={sourceMode}
              onChange={(e) => setSourceMode(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="local">Lokal</option>
              <option value="github">GitHub</option>
            </select>
          </div>

          {sourceMode === "github" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="repoFullName">Repository (owner/repo)</Label>
                <Input id="repoFullName" name="repoFullName" defaultValue={initialValues?.repoFullName || ""} placeholder="z.B. vercel/next.js" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultBranch">Branch</Label>
                <Input id="defaultBranch" name="defaultBranch" defaultValue={initialValues?.defaultBranch || "main"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateRootPath">Root-Pfad</Label>
                <Input id="templateRootPath" name="templateRootPath" defaultValue={initialValues?.templateRootPath || ""} placeholder="z.B. /templates/saas-landing" />
              </div>
            </>
          )}
        </div>
      </fieldset>

      {/* ── Tags ── */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <TagInput value={tags} onChange={setTags} />
      </div>

      {/* ── Preview ── */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground">Vorschau & Einstiegspunkte</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="previewImageUrl">Vorschaubild-URL</Label>
            <Input id="previewImageUrl" name="previewImageUrl" defaultValue={initialValues?.previewImageUrl || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="entryFile">Entry-Datei</Label>
            <Input id="entryFile" name="entryFile" defaultValue={initialValues?.entryFile || ""} placeholder="z.B. app/page.tsx" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="readmePath">README-Pfad</Label>
            <Input id="readmePath" name="readmePath" defaultValue={initialValues?.readmePath || "README.md"} />
          </div>
        </div>
      </fieldset>

      {/* ── Layout Code (nur für Local) ── */}
      {sourceMode === "local" && (
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-foreground">Code (Lokal)</legend>
          <div className="space-y-2">
            <Label htmlFor="layoutCode">Layout-Code</Label>
            <Textarea id="layoutCode" name="layoutCode" className="min-h-40 font-mono text-xs" defaultValue={initialValues?.layoutCode || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placeholdersSchema">Platzhalter-Schema (JSON)</Label>
            <Textarea
              id="placeholdersSchema"
              name="placeholdersSchema"
              className="min-h-32 font-mono text-xs"
              defaultValue={initialValues?.placeholdersSchema || '{\n  "title": "",\n  "subtitle": "",\n  "cta": ""\n}'}
            />
          </div>
        </fieldset>
      )}

      {error ? (
        <pre className="whitespace-pre-wrap rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          {error}
        </pre>
      ) : null}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Speichern..." : mode === "create" ? "Template erstellen" : "Template speichern"}
      </Button>
    </form>
  )
}
