"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TodoItem {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueAt: string | null
  assignedTo: string | null
  milestoneId: string | null
  milestone: { id: string; title: string } | null
}

interface MilestoneOption {
  id: string
  title: string
}

const STATUS_OPTIONS = ["open", "in_progress", "done", "cancelled"] as const
const PRIORITY_OPTIONS = ["low", "medium", "high"] as const

const STATUS_LABELS: Record<string, string> = {
  open: "Offen",
  in_progress: "In Bearbeitung",
  done: "Erledigt",
  cancelled: "Abgebrochen",
}

const PRIORITY_LABELS: Record<string, string> = {
  low: "Niedrig",
  medium: "Mittel",
  high: "Hoch",
}

interface TodosTabProps {
  projectId: string
  onRefetchOverview?: () => void
  /** When true, open the create drawer once (e.g. from header Add > To-do) */
  openCreateDrawer?: boolean
  onOpenCreateDrawer?: () => void
}

export function TodosTab({ projectId, onRefetchOverview, openCreateDrawer, onOpenCreateDrawer }: TodosTabProps) {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [milestones, setMilestones] = useState<MilestoneOption[]>([])
  const [loading, setLoading] = useState(true)
  const [quickTitle, setQuickTitle] = useState("")
  const [adding, setAdding] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null)
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formStatus, setFormStatus] = useState<string>("open")
  const [formPriority, setFormPriority] = useState<string>("medium")
  const [formDueAt, setFormDueAt] = useState("")
  const [formAssignedTo, setFormAssignedTo] = useState("")
  const [formMilestoneId, setFormMilestoneId] = useState<string>("")
  const [saving, setSaving] = useState(false)

  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/todos`)
      const json = await res.json()
      if (json.data) setTodos(json.data)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  const fetchMilestones = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/milestones`)
      const json = await res.json()
      if (json.data) setMilestones(json.data.map((m: MilestoneOption) => ({ id: m.id, title: m.title })))
    } catch {
      setMilestones([])
    }
  }, [projectId])

  useEffect(() => {
    void fetchTodos()
    void fetchMilestones()
  }, [fetchTodos, fetchMilestones])

  useEffect(() => {
    if (openCreateDrawer && onOpenCreateDrawer) {
      openCreate()
      onOpenCreateDrawer()
    }
  }, [openCreateDrawer])

  const openCreate = () => {
    setEditingTodo(null)
    setFormTitle("")
    setFormDescription("")
    setFormStatus("open")
    setFormPriority("medium")
    setFormDueAt("")
    setFormAssignedTo("")
    setFormMilestoneId("")
    setDrawerOpen(true)
  }

  const openEdit = (todo: TodoItem) => {
    setEditingTodo(todo)
    setFormTitle(todo.title)
    setFormDescription(todo.description ?? "")
    setFormStatus(todo.status)
    setFormPriority(todo.priority)
    setFormDueAt(todo.dueAt ? todo.dueAt.slice(0, 16) : "")
    setFormAssignedTo(todo.assignedTo ?? "")
    setFormMilestoneId(todo.milestoneId ?? "")
    setDrawerOpen(true)
  }

  const handleQuickAdd = async () => {
    const title = quickTitle.trim()
    if (!title || adding) return
    setAdding(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status: "open", priority: "medium" }),
      })
      if (res.ok) {
        setQuickTitle("")
        await fetchTodos()
        onRefetchOverview?.()
      }
    } finally {
      setAdding(false)
    }
  }

  const handleSaveDrawer = async () => {
    if (!formTitle.trim() || saving) return
    setSaving(true)
    try {
      if (editingTodo) {
        const res = await fetch(`/api/todos/${editingTodo.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle.trim(),
            description: formDescription.trim() || null,
            status: formStatus,
            priority: formPriority,
            dueAt: formDueAt ? new Date(formDueAt).toISOString() : null,
            assignedTo: formAssignedTo || null,
            milestoneId: formMilestoneId || null,
          }),
        })
        if (res.ok) {
          setDrawerOpen(false)
          await fetchTodos()
          onRefetchOverview?.()
        }
      } else {
        const res = await fetch(`/api/projects/${projectId}/todos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle.trim(),
            description: formDescription.trim() || null,
            status: formStatus,
            priority: formPriority,
            dueAt: formDueAt ? new Date(formDueAt).toISOString() : null,
            assignedTo: formAssignedTo || null,
            milestoneId: formMilestoneId || null,
          }),
        })
        if (res.ok) {
          setDrawerOpen(false)
          await fetchTodos()
          onRefetchOverview?.()
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (todo: TodoItem) => {
    if (!confirm("To-do wirklich löschen?")) return
    const res = await fetch(`/api/todos/${todo.id}`, { method: "DELETE" })
    if (res.ok) {
      await fetchTodos()
      onRefetchOverview?.()
      if (editingTodo?.id === todo.id) setDrawerOpen(false)
    }
  }

  const filtered = statusFilter === "all" ? todos : todos.filter((t) => t.status === statusFilter)

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">To-dos</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={openCreate}>Neu</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="flex gap-2">
            <Input
              placeholder="Enter erstellt To-do"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
              className="flex-1"
            />
            <Button size="sm" onClick={handleQuickAdd} disabled={!quickTitle.trim() || adding}>
              {adding ? "…" : "Hinzufügen"}
            </Button>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Lade To-dos…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">Keine To-dos.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Titel</TableHead>
                  <TableHead>Priorität</TableHead>
                  <TableHead>Fällig</TableHead>
                  <TableHead>Zugewiesen</TableHead>
                  <TableHead>Meilenstein</TableHead>
                  <TableHead className="w-[80px]">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((todo) => (
                  <TableRow key={todo.id}>
                    <TableCell>
                      <Select
                        value={todo.status}
                        onValueChange={async (v) => {
                          const res = await fetch(`/api/todos/${todo.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: v }),
                          })
                          if (res.ok) await fetchTodos()
                        }}
                      >
                        <SelectTrigger className="h-8 w-[130px] border-0 bg-transparent shadow-none">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="font-medium">{todo.title}</TableCell>
                    <TableCell>{PRIORITY_LABELS[todo.priority] ?? todo.priority}</TableCell>
                    <TableCell>
                      {todo.dueAt ? new Date(todo.dueAt).toLocaleDateString("de-DE") : "–"}
                    </TableCell>
                    <TableCell>{todo.assignedTo || "–"}</TableCell>
                    <TableCell>{todo.milestone?.title ?? "–"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(todo)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Bearbeiten</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(todo)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Löschen</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editingTodo ? "To-do bearbeiten" : "To-do erstellen"}</SheetTitle>
            <SheetDescription>
              Erfassen Sie hier eine Aufgabe für dieses Projekt. Titel und Status sind Pflicht, alle weiteren Angaben optional.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Titel</Label>
              <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Titel" />
            </div>
            <div className="space-y-2">
              <Label>Beschreibung (optional)</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Weitere Details zur Aufgabe …"
                rows={3}
                className="resize-none"
              />
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
              <Label>Priorität</Label>
              <Select value={formPriority} onValueChange={setFormPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>{PRIORITY_LABELS[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fällig (optional)</Label>
              <Input
                type="datetime-local"
                value={formDueAt}
                onChange={(e) => setFormDueAt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Zugewiesen (optional)</Label>
              <Input value={formAssignedTo} onChange={(e) => setFormAssignedTo(e.target.value)} placeholder="Name" />
            </div>
            <div className="space-y-2">
              <Label>Meilenstein (optional)</Label>
              <Select value={formMilestoneId || "none"} onValueChange={(v) => setFormMilestoneId(v === "none" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Meilenstein wählen" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">– Keiner –</SelectItem>
                  {milestones.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveDrawer} disabled={saving || !formTitle.trim()}>
                {saving ? "Speichern…" : "Speichern"}
              </Button>
              {editingTodo ? (
                <Button variant="outline" onClick={() => handleDelete(editingTodo)} className="text-destructive">
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
