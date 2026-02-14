"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { WizardShell } from "@/components/common/wizard-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface StartWorkflowWizardProps {
  companies: Array<{ id: string; name: string }>
  projects: Array<{ id: string; name: string; companyId: string; primaryCTA: string | null }>
  templates: Array<{ id: string; name: string }>
  designs: Array<{ id: string; name: string }>
}

const steps = ["Unternehmen", "Projekt", "Template", "Design", "Inhalt", "Prüfung"]

export function StartWorkflowWizard({ companies, projects, templates, designs }: StartWorkflowWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [companyId, setCompanyId] = useState("")
  const [projectId, setProjectId] = useState("")
  const [templateId, setTemplateId] = useState("")
  const [designId, setDesignId] = useState("")
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [cta, setCta] = useState("")
  const [links, setLinks] = useState("")
  const [scheduledAt, setScheduledAt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const filteredProjects = useMemo(
    () => projects.filter((project) => project.companyId === companyId),
    [companyId, projects]
  )

  const selectedProject = filteredProjects.find((project) => project.id === projectId)

  function moveNext() {
    setStep((value) => Math.min(6, value + 1))
  }

  function moveBack() {
    setStep((value) => Math.max(1, value - 1))
  }

  async function startWorkflow() {
    setIsLoading(true)

    const payload = {
      companyId,
      projectId,
      templateId,
      designId,
      scheduledAt: scheduledAt || undefined,
      contentFields: {
        title,
        subtitle,
        cta: cta || selectedProject?.primaryCTA || "",
        links: links.split(",").map((entry) => entry.trim()).filter(Boolean)
      }
    }

    const response = await fetch("/api/jobs/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    const result = await response.json()
    const jobId = result.data?.id
    if (jobId) await fetch(`/api/jobs/run?id=${jobId}`, { method: "POST" })

    setIsLoading(false)
    router.push("/workflows")
    router.refresh()
  }

  return (
    <WizardShell step={step} steps={steps}>
      <div className="rounded-xl border bg-card p-4">
        {step === 1 ? (
          <div className="space-y-3">
            <Label>Unternehmen wählen</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger><SelectValue placeholder="Unternehmen auswählen" /></SelectTrigger>
              <SelectContent>
                {companies.map((company) => <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            <Label>Projekt wählen</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger><SelectValue placeholder="Projekt auswählen" /></SelectTrigger>
              <SelectContent>
                {filteredProjects.map((project) => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            <Label>Template wählen</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger><SelectValue placeholder="Template auswählen" /></SelectTrigger>
              <SelectContent>
                {templates.map((template) => <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-3">
            <Label>Design wählen</Label>
            <Select value={designId} onValueChange={setDesignId}>
              <SelectTrigger><SelectValue placeholder="Design auswählen" /></SelectTrigger>
              <SelectContent>
                {designs.map((design) => <SelectItem key={design.id} value={design.id}>{design.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {step === 5 ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Titel</Label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Untertitel</Label>
              <Textarea value={subtitle} onChange={(event) => setSubtitle(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>CTA</Label>
              <Input value={cta} onChange={(event) => setCta(event.target.value)} placeholder={selectedProject?.primaryCTA || "Jetzt starten"} />
            </div>
            <div className="space-y-2">
              <Label>Links (kommagetrennt)</Label>
              <Input value={links} onChange={(event) => setLinks(event.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Zeitplan (optional)</Label>
              <Input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} />
            </div>
          </div>
        ) : null}

        {step === 6 ? (
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Unternehmen:</span> {companies.find((c) => c.id === companyId)?.name || "-"}</p>
            <p><span className="text-muted-foreground">Projekt:</span> {projects.find((p) => p.id === projectId)?.name || "-"}</p>
            <p><span className="text-muted-foreground">Template:</span> {templates.find((t) => t.id === templateId)?.name || "-"}</p>
            <p><span className="text-muted-foreground">Design:</span> {designs.find((d) => d.id === designId)?.name || "-"}</p>
            <p><span className="text-muted-foreground">Titel:</span> {title || "-"}</p>
            <p><span className="text-muted-foreground">Untertitel:</span> {subtitle || "-"}</p>
            <p><span className="text-muted-foreground">CTA:</span> {cta || selectedProject?.primaryCTA || "-"}</p>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" onClick={moveBack} disabled={step === 1}>Zurück</Button>
          {step < 6 ? (
            <Button onClick={moveNext}>Weiter</Button>
          ) : (
            <Button onClick={startWorkflow} disabled={isLoading}>{isLoading ? "Wird gestartet..." : "Prüfen & Starten"}</Button>
          )}
        </div>
      </div>
    </WizardShell>
  )
}
