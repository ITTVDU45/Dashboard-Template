"use client"

import { FormEvent, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { companySchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CompanyFormProps {
  mode: "create" | "edit"
  companyId?: string
  initialValues?: {
    name?: string
    website?: string
    industry?: string
    brandTone?: string
    colors?: string[]
    logoUrl?: string
    notes?: string
  }
}

export function CompanyForm({ mode, companyId, initialValues }: CompanyFormProps) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const defaults = useMemo(
    () => ({
      name: initialValues?.name ?? "",
      website: initialValues?.website ?? "",
      industry: initialValues?.industry ?? "",
      brandTone: initialValues?.brandTone ?? "",
      colors: initialValues?.colors?.join(", ") ?? "",
      logoUrl: initialValues?.logoUrl ?? "",
      notes: initialValues?.notes ?? ""
    }),
    [initialValues]
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    const form = new FormData(event.currentTarget)
    const payload = {
      name: String(form.get("name") || ""),
      website: String(form.get("website") || ""),
      industry: String(form.get("industry") || ""),
      brandTone: String(form.get("brandTone") || ""),
      colors: String(form.get("colors") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      logoUrl: String(form.get("logoUrl") || ""),
      notes: String(form.get("notes") || "")
    }

    const validated = companySchema.safeParse(payload)
    if (!validated.success) {
      setIsLoading(false)
      setError(z.prettifyError(validated.error))
      return
    }

    const url = mode === "create" ? "/api/companies" : `/api/companies/${companyId}`
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

    router.push("/companies")
    router.refresh()
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" defaultValue={defaults.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" defaultValue={defaults.website} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Branche</Label>
          <Input id="industry" name="industry" defaultValue={defaults.industry} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brandTone">Markenton</Label>
          <Input id="brandTone" name="brandTone" defaultValue={defaults.brandTone} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="colors">Farben (kommagetrennt)</Label>
          <Input id="colors" name="colors" defaultValue={defaults.colors} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="logoUrl">Logo-URL</Label>
          <Input id="logoUrl" name="logoUrl" defaultValue={defaults.logoUrl} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notizen</Label>
        <Textarea id="notes" name="notes" defaultValue={defaults.notes} />
      </div>
      {error ? <pre className="whitespace-pre-wrap rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">{error}</pre> : null}
      <Button disabled={isLoading} type="submit">
        {isLoading ? "Speichern..." : mode === "create" ? "Unternehmen erstellen" : "Unternehmen speichern"}
      </Button>
    </form>
  )
}
