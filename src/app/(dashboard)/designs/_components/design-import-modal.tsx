"use client"

import { useState } from "react"
import { Globe, Dribbble, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TagInput } from "@/components/common/tag-input"

interface DesignImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportComplete: () => void
}

type ImportTab = "web" | "dribbble" | "manual"

const TABS: { id: ImportTab; label: string; icon: typeof Globe }[] = [
  { id: "web", label: "Web URL", icon: Globe },
  { id: "dribbble", label: "Dribbble", icon: Dribbble },
  { id: "manual", label: "Manuell", icon: Upload },
]

export function DesignImportModal({ open, onOpenChange, onImportComplete }: DesignImportModalProps) {
  const [activeTab, setActiveTab] = useState<ImportTab>("web")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  // Web URL form
  const [webUrl, setWebUrl] = useState("")

  // Dribbble form
  const [dribbbleUrl, setDribbbleUrl] = useState("")

  // Manual form
  const [manualName, setManualName] = useState("")
  const [manualImageUrl, setManualImageUrl] = useState("")
  const [manualCategory, setManualCategory] = useState("")
  const [manualTags, setManualTags] = useState<string[]>([])
  const [manualDescription, setManualDescription] = useState("")

  function resetForms() {
    setWebUrl("")
    setDribbbleUrl("")
    setManualName("")
    setManualImageUrl("")
    setManualCategory("")
    setManualTags([])
    setManualDescription("")
    setResult(null)
  }

  async function handleWebImport() {
    if (!webUrl.trim()) return
    setIsLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/designs/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "web_crawl", inputData: { url: webUrl } }),
      })
      const payload = await res.json()
      if (res.ok) {
        // Direkt den Job ausführen (MVP)
        const job = payload.data
        await fetch(`/api/import-jobs/${job.id}`, { method: "POST" })
        setResult({ success: true, message: "Web-Design erfolgreich importiert!" })
        onImportComplete()
      } else {
        setResult({ success: false, message: payload.error || "Import fehlgeschlagen" })
      }
    } catch {
      setResult({ success: false, message: "Netzwerkfehler" })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDribbbleImport() {
    if (!dribbbleUrl.trim()) return
    setIsLoading(true)
    setResult(null)
    try {
      const shotId = dribbbleUrl.match(/shots\/(\d+)/)?.[1] || dribbbleUrl.trim()
      const res = await fetch("/api/designs/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "dribbble_sync", inputData: { url: dribbbleUrl, shotId } }),
      })
      const payload = await res.json()
      if (res.ok) {
        const job = payload.data
        await fetch(`/api/import-jobs/${job.id}`, { method: "POST" })
        setResult({ success: true, message: "Dribbble Shot erfolgreich importiert!" })
        onImportComplete()
      } else {
        setResult({ success: false, message: payload.error || "Import fehlgeschlagen" })
      }
    } catch {
      setResult({ success: false, message: "Netzwerkfehler" })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleManualImport() {
    if (!manualName.trim()) return
    setIsLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: manualName,
          description: manualDescription || undefined,
          sourceType: "local",
          coverImageUrl: manualImageUrl || undefined,
          category: manualCategory || undefined,
          tags: manualTags,
          status: "saved",
        }),
      })
      if (res.ok) {
        setResult({ success: true, message: "Design erfolgreich erstellt!" })
        onImportComplete()
      } else {
        const payload = await res.json()
        setResult({ success: false, message: payload.error || "Erstellen fehlgeschlagen" })
      }
    } catch {
      setResult({ success: false, message: "Netzwerkfehler" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForms()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Design importieren</DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setResult(null) }}
                className={`flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Result Message */}
        {result && (
          <div className={`rounded-md px-3 py-2 text-sm ${
            result.success
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-destructive/10 text-destructive"
          }`}>
            {result.message}
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-4 pt-2">
          {activeTab === "web" && (
            <>
              <div className="space-y-2">
                <Label>Website-URL</Label>
                <Input
                  value={webUrl}
                  onChange={(e) => setWebUrl(e.target.value)}
                  placeholder="https://example.com/landing-page"
                />
                <p className="text-xs text-muted-foreground">
                  Die URL wird analysiert und ein Screenshot wird erstellt (Crawler-Stub im MVP).
                </p>
              </div>
              <Button onClick={handleWebImport} disabled={isLoading || !webUrl.trim()} className="w-full">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importiere...</> : "Web-Design importieren"}
              </Button>
            </>
          )}

          {activeTab === "dribbble" && (
            <>
              <div className="space-y-2">
                <Label>Dribbble-URL oder Shot-ID</Label>
                <Input
                  value={dribbbleUrl}
                  onChange={(e) => setDribbbleUrl(e.target.value)}
                  placeholder="https://dribbble.com/shots/12345678 oder 12345678"
                />
                <p className="text-xs text-muted-foreground">
                  Der Shot wird importiert und mit Metadaten versehen (simuliert im MVP).
                </p>
              </div>
              <Button onClick={handleDribbbleImport} disabled={isLoading || !dribbbleUrl.trim()} className="w-full">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importiere...</> : "Dribbble Shot importieren"}
              </Button>
            </>
          )}

          {activeTab === "manual" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="Design-Name" />
                </div>
                <div className="space-y-2">
                  <Label>Kategorie</Label>
                  <Input value={manualCategory} onChange={(e) => setManualCategory(e.target.value)} placeholder="z.B. hero, pricing" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Bild-URL</Label>
                  <Input value={manualImageUrl} onChange={(e) => setManualImageUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <TagInput value={manualTags} onChange={setManualTags} />
              </div>
              <div className="space-y-2">
                <Label>Beschreibung</Label>
                <Textarea
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                  placeholder="Optionale Beschreibung..."
                  rows={2}
                />
              </div>
              <Button onClick={handleManualImport} disabled={isLoading || !manualName.trim()} className="w-full">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Erstelle...</> : "Design erstellen"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
