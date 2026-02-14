"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export interface CompanyContactItem {
  id: string
  name: string
  role: string | null
  email: string | null
  phone: string | null
  linkedIn: string | null
  responsibilities: string | null
  isDecisionMaker: boolean
  notes: string | null
}

interface ContactsTabProps {
  companyId: string
  initialContacts: CompanyContactItem[]
}

export function ContactsTab({ companyId, initialContacts }: ContactsTabProps) {
  const [contacts, setContacts] = useState(initialContacts)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const editing = useMemo(() => contacts.find((c) => c.id === editingId) ?? null, [contacts, editingId])

  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [linkedIn, setLinkedIn] = useState("")
  const [responsibilities, setResponsibilities] = useState("")
  const [isDecisionMaker, setIsDecisionMaker] = useState(false)
  const [notes, setNotes] = useState("")

  function resetForm() {
    setName("")
    setRole("")
    setEmail("")
    setPhone("")
    setLinkedIn("")
    setResponsibilities("")
    setIsDecisionMaker(false)
    setNotes("")
    setEditingId(null)
  }

  function openCreate() {
    resetForm()
    setOpen(true)
  }

  function openEdit(item: CompanyContactItem) {
    setEditingId(item.id)
    setName(item.name)
    setRole(item.role ?? "")
    setEmail(item.email ?? "")
    setPhone(item.phone ?? "")
    setLinkedIn(item.linkedIn ?? "")
    setResponsibilities(item.responsibilities ?? "")
    setIsDecisionMaker(item.isDecisionMaker)
    setNotes(item.notes ?? "")
    setOpen(true)
  }

  async function save() {
    const payload = {
      name,
      role,
      email,
      phone,
      linkedIn,
      responsibilities,
      isDecisionMaker,
      notes,
    }
    const response = await fetch(
      editingId ? `/api/contacts/${editingId}` : `/api/companies/${companyId}/contacts`,
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )
    if (!response.ok) return
    const data = await response.json()
    const entity = data.data as CompanyContactItem
    setContacts((prev) => (editingId ? prev.map((item) => (item.id === editingId ? entity : item)) : [entity, ...prev]))
    setOpen(false)
    resetForm()
  }

  async function remove(id: string) {
    const response = await fetch(`/api/contacts/${id}`, { method: "DELETE" })
    if (!response.ok) return
    setContacts((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Ansprechpartner</CardTitle>
          <Button onClick={openCreate}>Neu</Button>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {contacts.map((contact) => (
            <div key={contact.id} className="rounded-xl border border-border/70 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium">{contact.name}</h4>
                {contact.isDecisionMaker ? <Badge>Entscheider</Badge> : null}
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{contact.role ?? "-"}</p>
                <p>{contact.email ?? "-"}</p>
                <p>{contact.phone ?? "-"}</p>
                <p>{contact.linkedIn ?? "-"}</p>
                <p>{contact.responsibilities ?? "-"}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(contact)}>Bearbeiten</Button>
                <Button variant="destructive" size="sm" onClick={() => remove(contact.id)}>Loschen</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editing ? "Kontakt bearbeiten" : "Kontakt erstellen"}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Rolle</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>E-Mail</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn</Label>
              <Input value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Verantwortungsbereich</Label>
              <Input value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2">
              <Label>Entscheider</Label>
              <Switch checked={isDecisionMaker} onCheckedChange={setIsDecisionMaker} />
            </div>
            <div className="space-y-2">
              <Label>Notizen</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </div>
            <Button onClick={save}>Speichern</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
