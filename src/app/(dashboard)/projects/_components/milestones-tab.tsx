"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MilestoneItem {
  id: string
  title: string
  description: string | null
  status: string
  dueAt: string | null
  sortOrder: number
  _count?: { todos: number }
}

const STATUS_OPTIONS = ["planned", "in_progress", "done"] as const
const STATUS_LABELS: Record<string, string> = {
  planned: "Geplant",
  in_progress: "In Bearbeitung",
  done: "Erledigt",
}

interface MilestonesTabProps {
  projectId: string
  onRefetchOverview?: () => void
  openCreateDrawer?: boolean
  onOpenCreateDrawer?: () => void
}

export function MilestonesTab({
  projectId,
  onRefetchOverview,
  openCreateDrawer,
  onOpenCreateDrawer,
}: MilestonesTabProps) {
  const [milestones, setMilestones] = useState<MilestoneItem[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState<MilestoneItem | null>(null)
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formStatus, setFormStatus] = useState<string>("planned")
  const [formDueAt, setFormDueAt] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchMilestones = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/milestones`)
      const json = await res.json()
      if (json.data) setMilestones(json.data)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    void fetchMilestones()
  }, [fetchMilestones])

  useEffect(() => {
    if (openCreateDrawer && onOpenCreateDrawer) {
      setEditing(null)
      setFormTitle("")
      setFormDescription("")
      setFormStatus("planned")
      setFormDueAt("")
      setDrawerOpen(true)
      onOpenCreateDrawer()
    }
  }, [openCreateDrawer, onOpenCreateDrawer])

  const openCreate = () => {
    setEditing(null)
    setFormTitle("")
    setFormDescription("")
    setFormStatus("planned")
    setFormDueAt("")
    setDrawerOpen(true)
  }

  const openEdit = (m: MilestoneItem) => {
    setEditing(m)
    setFormTitle(m.title)
    setFormDescription(m.description ?? "")
    setFormStatus(m.status)
    setFormDueAt(m.dueAt ? m.dueAt.slice(0, 16) : "")
    setDrawerOpen(true)
  }

  const handleSave = async () => {
    if (!formTitle.trim() || saving) return
    setSaving(true)
    try {
      if (editing) {
        const res = await fetch(`/api/milestones/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle.trim(),
            description: formDescription || null,
            status: formStatus,
            dueAt: formDueAt ? new Date(formDueAt).toISOString() : null,
          }),
        })
        if (res.ok) {
          setDrawerOpen(false)
          await fetchMilestones()
          onRefetchOverview?.()
        }
      } else {
        const res = await fetch(`/api/projects/${projectId}/milestones`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle.trim(),
            description: formDescription || null,
            status: formStatus,
            dueAt: formDueAt ? new Date(formDueAt).toISOString() : null,
          }),
        })
        if (res.ok) {
          setDrawerOpen(false)
          await fetchMilestones()
          onRefetchOverview?.()
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (m: MilestoneItem) => {
    if (!confirm("Meilenstein wirklich löschen?")) return
    const res = await fetch(`/api/milestones/${m.id}`, { method: "DELETE" })
    if (res.ok) {
      await fetchMilestones()
      onRefetchOverview?.()
      if (editing?.id === m.id) setDrawerOpen(false)
    }
  }

  const doneCount = milestones.filter((m) => m.status === "done").length

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Meilensteine</CardTitle>
            <Button size="sm" onClick={openCreate}>Neu</Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <p className="text-sm text-muted-foreground">Lade Meilensteine…</p>
          ) : milestones.length === 0 ? (
            <p className="text-sm text-muted-foreground">Keine Meilensteine.</p>
          ) : (
            <ul className="space-y-3">
              {milestones.map((m) => (
                <li
                  key={m.id}
                  className={cn(
                    "flex flex-col gap-2 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between",
                    m.status === "done" ? "border-border/60 bg-muted/20" : "border-border/70 bg-card/40"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          m.status === "done" && "bg-primary/20 text-primary",
                          m.status === "in_progress" && "bg-amber-500/20 text-amber-700 dark:text-amber-400",
                          m.status === "planned" && "bg-muted text-muted-foreground"
                        )}
                      >
                        {STATUS_LABELS[m.status] ?? m.status}
                      </span>
                      {m.dueAt ? (
                        <span className="text-xs text-muted-foreground">
                          {new Date(m.dueAt).toLocaleDateString("de-DE")}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-1 font-medium">{m.title}</h3>
                    {m.description ? (
                      <p className="mt-0.5 text-sm text-muted-foreground">{m.description}</p>
                    ) : null}
                    {m._count != null ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Fortschritt: {milestones.filter((x) => x.id === m.id)[0]?._count?.todos ?? 0} Tasks
                      </p>
                    ) : null}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(m)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Bearbeiten</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(m)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Löschen</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {milestones.length > 0 ? (
            <p className="mt-3 text-xs text-muted-foreground">
              {doneCount} / {milestones.length} erledigt
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editing ? "Meilenstein bearbeiten" : "Meilenstein erstellen"}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Titel</Label>
              <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Titel" />
            </div>
            <div className="space-y-2">
              <Label>Beschreibung (optional)</Label>
              <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Definition of Done …" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formStatus} onValueChange={setFormStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fällig (optional)</Label>
              <Input type="datetime-local" value={formDueAt} onChange={(e) => setFormDueAt(e.target.value)} />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} disabled={saving || !formTitle.trim()}>
                {saving ? "Speichern…" : "Speichern"}
              </Button>
              {editing ? (
                <Button variant="outline" onClick={() => handleDelete(editing)} className="text-destructive">
                  Löschen
                </Button>
              ) : null}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
