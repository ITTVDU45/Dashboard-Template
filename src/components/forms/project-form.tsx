"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { projectSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { getProjectPrefillFromCompany } from "@/lib/automation/company-rules"

interface ProjectFormProps {
  mode: "create" | "edit"
  projectId?: string
  companies: Array<{
    id: string
    name: string
    shortPitch?: string | null
    targetMarket?: string | null
    usp?: string | null
    websiteSystem?: string | null
    techStack?: string | null
  }>
  templateCategories?: string[]
  initialValues?: {
    companyId?: string
    name?: string
    slug?: string
    objective?: string
    targetAudience?: string
    primaryCTA?: string
    status?: string
    description?: string
    owner?: string
    startDate?: string
    endDate?: string
    technologies?: string[]
    contactPerson?: string
    workflowAssignmentEnabled?: boolean
    preferredTemplateCategories?: string[]
  }
}

export function ProjectForm({ mode, projectId, companies, templateCategories, initialValues }: ProjectFormProps) {
  const router = useRouter()
  const [companyId, setCompanyId] = useState(initialValues?.companyId || "")
  const [status, setStatus] = useState(initialValues?.status || "active")
  const [workflowAssignmentEnabled, setWorkflowAssignmentEnabled] = useState(
    initialValues?.workflowAssignmentEnabled ?? true
  )
  const [objective, setObjective] = useState(initialValues?.objective || "")
  const [targetAudience, setTargetAudience] = useState(initialValues?.targetAudience || "")
  const [primaryCTA, setPrimaryCTA] = useState(initialValues?.primaryCTA || "")
  const [technologiesInput, setTechnologiesInput] = useState(initialValues?.technologies?.join(", ") || "")
  const [preferredCategories, setPreferredCategories] = useState<string[]>(
    initialValues?.preferredTemplateCategories ?? []
  )
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const toggleCategory = (cat: string) => {
    setPreferredCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === companyId),
    [companies, companyId]
  )

  useEffect(() => {
    if (mode !== "create" || !selectedCompany) return
    const prefill = getProjectPrefillFromCompany(selectedCompany)
    if (!objective && prefill.objective) setObjective(prefill.objective)
    if (!targetAudience && prefill.targetAudience) setTargetAudience(prefill.targetAudience)
    if (!primaryCTA && prefill.primaryCTA) setPrimaryCTA(prefill.primaryCTA)
    if (!technologiesInput && prefill.technologies.length > 0) setTechnologiesInput(prefill.technologies.join(", "))
  }, [mode, objective, targetAudience, primaryCTA, technologiesInput, selectedCompany])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    const form = new FormData(event.currentTarget)
    const technologiesRaw = technologiesInput.trim()
    const technologiesArray = technologiesRaw
      ? technologiesRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : []

    const payload = {
      companyId,
      name: String(form.get("name") || ""),
      slug: String(form.get("slug") || ""),
      objective: objective.trim(),
      targetAudience: targetAudience.trim(),
      primaryCTA: primaryCTA.trim(),
      status,
      description: String(form.get("description") || "").trim() || undefined,
      owner: String(form.get("owner") || "").trim() || undefined,
      contactPerson: String(form.get("contactPerson") || "").trim() || undefined,
      startDate: (form.get("startDate") as string) || undefined,
      endDate: (form.get("endDate") as string) || undefined,
      technologies: technologiesArray.length > 0 ? technologiesArray : undefined,
      workflowAssignmentEnabled,
      preferredTemplateCategories: preferredCategories.length > 0 ? preferredCategories : undefined,
    }

    if (payload.startDate) (payload as Record<string, unknown>).startDate = new Date(payload.startDate).toISOString()
    if (payload.endDate) (payload as Record<string, unknown>).endDate = new Date(payload.endDate).toISOString()

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
      body: JSON.stringify(validated.data),
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
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Basis</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Unternehmen *</Label>
            <Select value={companyId} onValueChange={setCompanyId} required>
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
            <Input id="slug" name="slug" required defaultValue={initialValues?.slug || ""} placeholder="z. B. produkt-launch-q1" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Beschreibung & Ziele</h3>
        <div className="space-y-2">
          <Label htmlFor="description">Projektbeschreibung</Label>
          <Textarea id="description" name="description" rows={3} defaultValue={initialValues?.description || ""} placeholder="Kurze Beschreibung des Projekts" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="objective">Zielsetzung</Label>
          <Textarea id="objective" name="objective" value={objective} onChange={(event) => setObjective(event.target.value)} placeholder="Was soll erreicht werden?" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetAudience">Zielgruppe</Label>
          <Textarea id="targetAudience" name="targetAudience" value={targetAudience} onChange={(event) => setTargetAudience(event.target.value)} placeholder="Zielgruppe beschreiben" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="primaryCTA">Primärer CTA</Label>
          <Input id="primaryCTA" name="primaryCTA" value={primaryCTA} onChange={(event) => setPrimaryCTA(event.target.value)} placeholder="z. B. Jetzt starten" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Termine</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startDate">Startdatum</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              defaultValue={initialValues?.startDate ? initialValues.startDate.slice(0, 10) : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Zieltermin</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              defaultValue={initialValues?.endDate ? initialValues.endDate.slice(0, 10) : ""}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Technik & Verantwortung</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="technologies">Technologien</Label>
            <Input
              id="technologies"
              name="technologies"
              value={technologiesInput}
              onChange={(event) => setTechnologiesInput(event.target.value)}
              placeholder="z. B. React, Next.js, MinIO (kommagetrennt)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner">Verantwortlich</Label>
            <Input id="owner" name="owner" defaultValue={initialValues?.owner || ""} placeholder="Name des Verantwortlichen" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="contactPerson">Ansprechpartner</Label>
            <Input id="contactPerson" name="contactPerson" defaultValue={initialValues?.contactPerson || ""} placeholder="Ansprechpartner im Projekt" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Optionen</h3>
        <div className="flex items-center space-x-2">
          <Switch
            id="workflowAssignmentEnabled"
            checked={workflowAssignmentEnabled}
            onCheckedChange={setWorkflowAssignmentEnabled}
          />
          <Label htmlFor="workflowAssignmentEnabled" className="cursor-pointer font-normal">
            Zuweisung von Workflows erlauben
          </Label>
        </div>
        {templateCategories && templateCategories.length > 0 ? (
          <div className="space-y-2">
            <Label>Passende Templategruppen (Mehrfachauswahl)</Label>
            <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-muted/30 p-3">
              {templateCategories.map((cat) => (
                <label
                  key={cat}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted/50",
                    preferredCategories.includes(cat) ? "border-primary bg-primary/10" : "border-border"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={preferredCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <pre className="whitespace-pre-wrap rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          {error}
        </pre>
      ) : null}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Speichern..." : mode === "create" ? "Projekt erstellen" : "Projekt speichern"}
      </Button>
    </form>
  )
}
