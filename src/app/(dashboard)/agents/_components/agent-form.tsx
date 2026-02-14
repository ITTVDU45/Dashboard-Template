"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { agentSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { TYPE_LABELS } from "../_lib/constants"

interface AgentFormProps {
  mode: "create" | "edit"
  agentId?: string
  initialValues?: {
    name?: string
    type?: "content" | "design" | "code" | "qc"
    modelHint?: string
    enabled?: boolean
    config?: string
  }
}

export function AgentForm({ mode, agentId, initialValues }: AgentFormProps) {
  const router = useRouter()
  const [type, setType] = useState<"content" | "design" | "code" | "qc">(initialValues?.type || "content")
  const [enabled, setEnabled] = useState(initialValues?.enabled ?? true)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsLoading(true)
    const form = new FormData(event.currentTarget)

    const payload = {
      name: String(form.get("name") || ""),
      type,
      modelHint: String(form.get("modelHint") || ""),
      enabled,
      config: JSON.parse(String(form.get("config") || "{}"))
    }

    const validated = agentSchema.safeParse(payload)
    if (!validated.success) {
      setError(z.prettifyError(validated.error))
      setIsLoading(false)
      return
    }

    const response = await fetch(mode === "create" ? "/api/agents" : `/api/agents/${agentId}`, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated.data)
    })

    setIsLoading(false)
    if (!response.ok) {
      setError("Speichern fehlgeschlagen.")
      return
    }

    router.push("/agents")
    router.refresh()
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" name="name" required defaultValue={initialValues?.name || ""} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Typ</Label>
          <Select value={type} onValueChange={(value) => setType(value as "content" | "design" | "code" | "qc")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="modelHint">Modell-Hinweis</Label>
          <Input id="modelHint" name="modelHint" defaultValue={initialValues?.modelHint || ""} />
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-md border p-3">
        <Switch checked={enabled} onCheckedChange={setEnabled} />
        <span className="text-sm">Aktiv</span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="config">Konfigurations-JSON</Label>
        <Textarea id="config" name="config" className="min-h-32 font-mono text-xs" defaultValue={initialValues?.config || "{}"} />
      </div>
      {error ? (
        <pre className="whitespace-pre-wrap rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          {error}
        </pre>
      ) : null}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Speichern..." : mode === "create" ? "Agent erstellen" : "Agent speichern"}
      </Button>
    </form>
  )
}
