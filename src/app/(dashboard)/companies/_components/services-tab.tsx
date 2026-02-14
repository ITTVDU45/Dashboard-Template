"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export interface CompanyServiceItem {
  id: string
  category: string
  title: string
  description: string | null
  keywords: string | null
  relevanceScore: number | null
}

interface ServicesTabProps {
  companyId: string
  initialServices: CompanyServiceItem[]
  onExtractServices: () => void
}

function parseKeywords(value: string | null) {
  if (!value) return "-"
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed.join(", ")
  } catch {}
  return value
}

export function ServicesTab({ companyId, initialServices, onExtractServices }: ServicesTabProps) {
  const [services, setServices] = useState(initialServices)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [category, setCategory] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [keywords, setKeywords] = useState("")
  const [relevance, setRelevance] = useState("")

  function resetForm() {
    setCategory("")
    setTitle("")
    setDescription("")
    setKeywords("")
    setRelevance("")
    setEditingId(null)
  }

  function openCreate() {
    resetForm()
    setOpen(true)
  }

  function openEdit(item: CompanyServiceItem) {
    setEditingId(item.id)
    setCategory(item.category)
    setTitle(item.title)
    setDescription(item.description ?? "")
    setKeywords(parseKeywords(item.keywords) === "-" ? "" : parseKeywords(item.keywords))
    setRelevance(item.relevanceScore?.toString() ?? "")
    setOpen(true)
  }

  async function save() {
    const payload = {
      category,
      title,
      description,
      keywords: keywords.split(",").map((x) => x.trim()).filter(Boolean),
      relevanceScore: relevance ? Number(relevance) : undefined,
    }
    const response = await fetch(
      editingId ? `/api/services/${editingId}` : `/api/companies/${companyId}/services`,
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )
    if (!response.ok) return
    const data = await response.json()
    const entity = data.data as CompanyServiceItem
    setServices((prev) => (editingId ? prev.map((item) => (item.id === editingId ? entity : item)) : [entity, ...prev]))
    setOpen(false)
    resetForm()
  }

  async function remove(id: string) {
    const response = await fetch(`/api/services/${id}`, { method: "DELETE" })
    if (!response.ok) return
    setServices((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Leistungen</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onExtractServices}>Leistungen von Website extrahieren</Button>
          <Button onClick={openCreate}>Neu</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kategorie</TableHead>
              <TableHead>Titel</TableHead>
              <TableHead>Keywords</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{parseKeywords(item.keywords)}</TableCell>
                <TableCell>{item.relevanceScore?.toFixed(2) ?? "-"}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(item)}>Bearbeiten</Button>
                  <Button variant="destructive" size="sm" onClick={() => remove(item.id)}>Loschen</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingId ? "Leistung bearbeiten" : "Leistung erstellen"}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            <div className="space-y-2">
              <Label>Kategorie</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Titel</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Beschreibung</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Keywords (kommagetrennt)</Label>
              <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Relevanzscore (0-1)</Label>
              <Input value={relevance} onChange={(e) => setRelevance(e.target.value)} />
            </div>
            <Button onClick={save}>Speichern</Button>
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  )
}
