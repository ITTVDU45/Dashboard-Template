"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { projectSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProjectFormProps {
  mode: "create" | "edit"
  projectId?: string
  companies: Array<{ id: string; name: string }>
  initialValues?: {
    companyId?: string
    name?: string
    slug?: string
    objective?: string
    targetAudience?: string
    primaryCTA?: string
    status?: string
  }
}

export function ProjectForm({ mode, projectId, companies, initialValues }: ProjectFormProps) {
  const router = useRouter()
  const [companyId, setCompanyId] = useState(initialValues?.companyId || "")
  const [status, setStatus] = useState(initialValues?.status || "active")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    const form = new FormData(event.currentTarget)
    const payload = {
      companyId,
      name: String(form.get("name") || ""),
      slug: String(form.get("slug") || ""),
      objective: String(form.get("objective") || ""),
      targetAudience: String(form.get("targetAudience") || ""),
      primaryCTA: String(form.get("primaryCTA") || ""),
      status
    }

    const validated = projectSchema.safeParse(payload)
    if (!validated.success) {
      setError(z.prettifyError(validated.error))
      setIsLoading(false)
      return
    }

    const url = mode === "create" ? "/api/projects" : `/api/projects/${projectId}`
    const method = mode === "create" ? "POST" : "PUT"

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated.data)
    })

    setIsLoading(false)
    if (!response.ok) {
      setError("Speichern fehlgeschlagen.")
      return
    }

    router.push("/projects")
    router.refresh()
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Unternehmen *</Label>
          <Select value={companyId} onValueChange={setCompanyId}>
            <SelectTrigger><SelectValue placeholder="Unternehmen wählen" /></SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="paused">Pausiert</SelectItem>
              <SelectItem value="archived">Archiviert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" required defaultValue={initialValues?.name || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" name="slug" required defaultValue={initialValues?.slug || ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="primaryCTA">Primärer CTA</Label>
          <Input id="primaryCTA" name="primaryCTA" defaultValue={initialValues?.primaryCTA || ""} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="targetAudience">Zielgruppe</Label>
        <Textarea id="targetAudience" name="targetAudience" defaultValue={initialValues?.targetAudience || ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="objective">Zielsetzung</Label>
        <Textarea id="objective" name="objective" defaultValue={initialValues?.objective || ""} />
      </div>
      {error ? <pre className="whitespace-pre-wrap rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">{error}</pre> : null}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Speichern..." : mode === "create" ? "Projekt erstellen" : "Projekt speichern"}
      </Button>
    </form>
  )
}
