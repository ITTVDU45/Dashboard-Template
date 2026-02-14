"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export interface ActivityLogEntry {
  id: string
  entityType: string
  entityId: string
  action: string
  summary: string | null
  payload: string | null
  createdAt: string
}

const FILTER_TYPES = [
  { value: "all", label: "Alle" },
  { value: "tasks", label: "Tasks" },
  { value: "milestones", label: "Meilensteine" },
  { value: "finance", label: "Finanzen" },
  { value: "jobs", label: "Jobs" },
  { value: "assets", label: "Assets" },
  { value: "Note", label: "Notizen" },
] as const

function formatRelative(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffM = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)
  if (diffM < 1) return "gerade eben"
  if (diffM < 60) return `vor ${diffM} Min.`
  if (diffH < 24) return `vor ${diffH} Std.`
  if (diffD < 7) return `vor ${diffD} Tagen`
  return date.toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })
}

function getTypeTag(entityType: string): string {
  const map: Record<string, string> = {
    Todo: "Task",
    Milestone: "Meilenstein",
    Offer: "Finanzen",
    Invoice: "Finanzen",
    Job: "Job",
    Asset: "Asset",
    Note: "Notiz",
  }
  return map[entityType] ?? entityType
}

interface ActivitiesTabProps {
  projectId: string
  onRefetchOverview?: () => void
}

export function ActivitiesTab({ projectId, onRefetchOverview }: ActivitiesTabProps) {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [noteText, setNoteText] = useState("")
  const [addingNote, setAddingNote] = useState(false)
  const [selectedLog, setSelectedLog] = useState<ActivityLogEntry | null>(null)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const typeParam = filter === "all" ? "" : `&type=${encodeURIComponent(filter)}`
      const res = await fetch(`/api/projects/${projectId}/activities?${typeParam}`)
      const json = await res.json()
      if (json.data) {
        setLogs(
          json.data.map((l: { id: string; entityType: string; entityId: string; action: string; summary: string | null; payload: string | null; createdAt: string }) => ({
            id: l.id,
            entityType: l.entityType,
            entityId: l.entityId,
            action: l.action,
            summary: l.summary,
            payload: l.payload,
            createdAt: l.createdAt,
          }))
        )
      }
    } finally {
      setLoading(false)
    }
  }, [projectId, filter])

  useEffect(() => {
    void fetchLogs()
  }, [fetchLogs])

  const handleAddNote = async () => {
    const text = noteText.trim()
    if (!text || addingNote) return
    setAddingNote(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary: text }),
      })
      if (res.ok) {
        setNoteText("")
        await fetchLogs()
        onRefetchOverview?.()
      }
    } finally {
      setAddingNote(false)
    }
  }

  const filteredForDisplay = logs

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Aktivitäten</CardTitle>
            <div className="flex flex-wrap gap-1.5">
              {FILTER_TYPES.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    filter === f.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="flex gap-2">
            <Input
              placeholder="Notiz hinzufügen…"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              className="flex-1"
            />
            <Button size="sm" onClick={handleAddNote} disabled={!noteText.trim() || addingNote}>
              {addingNote ? "…" : "Hinzufügen"}
            </Button>
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Lade Aktivitäten…</p>
          ) : filteredForDisplay.length === 0 ? (
            <p className="text-sm text-muted-foreground">Keine Aktivitäten.</p>
          ) : (
            <ul className="space-y-1">
              {filteredForDisplay.map((log) => (
                <li key={log.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedLog(log)}
                    className="flex w-full flex-col gap-0.5 rounded-lg border border-transparent p-2 text-left transition-colors hover:bg-muted/50 hover:border-border sm:flex-row sm:items-center sm:gap-3"
                  >
                    <span className="text-sm text-foreground">
                      {log.summary || `${log.entityType} ${log.action}`}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelative(new Date(log.createdAt))}
                    </span>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {getTypeTag(log.entityType)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Sheet open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Aktivitätsdetails</SheetTitle>
          </SheetHeader>
          {selectedLog ? (
            <div className="mt-4 space-y-3 text-sm">
              <p><span className="text-muted-foreground">Typ:</span> {selectedLog.entityType}</p>
              <p><span className="text-muted-foreground">Aktion:</span> {selectedLog.action}</p>
              <p><span className="text-muted-foreground">ID:</span> {selectedLog.entityId}</p>
              <p><span className="text-muted-foreground">Zusammenfassung:</span> {selectedLog.summary ?? "–"}</p>
              {selectedLog.payload ? (
                <pre className="max-h-48 overflow-auto rounded bg-muted/50 p-2 text-xs">
                  {typeof selectedLog.payload === "string"
                    ? (() => {
                        try {
                          return JSON.stringify(JSON.parse(selectedLog.payload), null, 2)
                        } catch {
                          return selectedLog.payload
                        }
                      })()
                    : selectedLog.payload}
                </pre>
              ) : null}
              <p className="text-muted-foreground">
                {new Date(selectedLog.createdAt).toLocaleString("de-DE")}
              </p>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}
