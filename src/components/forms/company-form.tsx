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
    employeeCount?: number | null
    foundingYear?: number | null
    websiteSystem?: string
    googleRating?: number | null
    googleReviewCount?: number | null
    location?: string
    description?: string
    shortPitch?: string
    usp?: string[]
    positioning?: string
    businessModel?: string
    targetMarket?: string
    priceLevel?: string
    marketPosition?: string
    googleAddress?: string
    googleMapsLink?: string
    googleOpeningHours?: string
    sslEnabled?: boolean | null
    websiteReachable?: boolean | null
    avgLoadTime?: number | null
    socialMedia?: string
    techStack?: string
    generalEmail?: string
    generalPhone?: string
    supportEmail?: string
    salesEmail?: string
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
      notes: initialValues?.notes ?? "",
      employeeCount: initialValues?.employeeCount?.toString() ?? "",
      foundingYear: initialValues?.foundingYear?.toString() ?? "",
      websiteSystem: initialValues?.websiteSystem ?? "",
      googleRating: initialValues?.googleRating?.toString() ?? "",
      googleReviewCount: initialValues?.googleReviewCount?.toString() ?? "",
      location: initialValues?.location ?? "",
      description: initialValues?.description ?? "",
      shortPitch: initialValues?.shortPitch ?? "",
      usp: initialValues?.usp?.join("\n") ?? "",
      positioning: initialValues?.positioning ?? "",
      businessModel: initialValues?.businessModel ?? "",
      targetMarket: initialValues?.targetMarket ?? "",
      priceLevel: initialValues?.priceLevel ?? "",
      marketPosition: initialValues?.marketPosition ?? "",
      googleAddress: initialValues?.googleAddress ?? "",
      googleMapsLink: initialValues?.googleMapsLink ?? "",
      googleOpeningHours: initialValues?.googleOpeningHours ?? "",
      sslEnabled: initialValues?.sslEnabled === true,
      websiteReachable: initialValues?.websiteReachable === true,
      avgLoadTime: initialValues?.avgLoadTime?.toString() ?? "",
      socialMedia: initialValues?.socialMedia ?? "",
      techStack: initialValues?.techStack ?? "",
      generalEmail: initialValues?.generalEmail ?? "",
      generalPhone: initialValues?.generalPhone ?? "",
      supportEmail: initialValues?.supportEmail ?? "",
      salesEmail: initialValues?.salesEmail ?? "",
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
      notes: String(form.get("notes") || ""),
      employeeCount: String(form.get("employeeCount") || "") ? Number(form.get("employeeCount")) : undefined,
      foundingYear: String(form.get("foundingYear") || "") ? Number(form.get("foundingYear")) : undefined,
      websiteSystem: String(form.get("websiteSystem") || ""),
      googleRating: String(form.get("googleRating") || "") ? Number(form.get("googleRating")) : undefined,
      googleReviewCount: String(form.get("googleReviewCount") || "") ? Number(form.get("googleReviewCount")) : undefined,
      location: String(form.get("location") || ""),
      description: String(form.get("description") || ""),
      shortPitch: String(form.get("shortPitch") || ""),
      usp: String(form.get("usp") || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      positioning: String(form.get("positioning") || ""),
      businessModel: String(form.get("businessModel") || ""),
      targetMarket: String(form.get("targetMarket") || ""),
      priceLevel: String(form.get("priceLevel") || ""),
      marketPosition: String(form.get("marketPosition") || ""),
      googleAddress: String(form.get("googleAddress") || ""),
      googleMapsLink: String(form.get("googleMapsLink") || ""),
      googleOpeningHours: String(form.get("googleOpeningHours") || ""),
      sslEnabled: form.get("sslEnabled") === "on",
      websiteReachable: form.get("websiteReachable") === "on",
      avgLoadTime: String(form.get("avgLoadTime") || "") ? Number(form.get("avgLoadTime")) : undefined,
      socialMedia: String(form.get("socialMedia") || ""),
      techStack: String(form.get("techStack") || ""),
      generalEmail: String(form.get("generalEmail") || ""),
      generalPhone: String(form.get("generalPhone") || ""),
      supportEmail: String(form.get("supportEmail") || ""),
      salesEmail: String(form.get("salesEmail") || ""),
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
        <div className="space-y-2">
          <Label htmlFor="employeeCount">Mitarbeiterzahl</Label>
          <Input id="employeeCount" name="employeeCount" defaultValue={defaults.employeeCount} type="number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="foundingYear">Grundungsjahr</Label>
          <Input id="foundingYear" name="foundingYear" defaultValue={defaults.foundingYear} type="number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="websiteSystem">Website-System</Label>
          <Input id="websiteSystem" name="websiteSystem" defaultValue={defaults.websiteSystem} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Standort</Label>
          <Input id="location" name="location" defaultValue={defaults.location} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="googleRating">Google Rating</Label>
          <Input id="googleRating" name="googleRating" defaultValue={defaults.googleRating} type="number" step="0.1" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="googleReviewCount">Google Bewertungen</Label>
          <Input id="googleReviewCount" name="googleReviewCount" defaultValue={defaults.googleReviewCount} type="number" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="googleAddress">Google Adresse</Label>
          <Input id="googleAddress" name="googleAddress" defaultValue={defaults.googleAddress} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="googleMapsLink">Google Maps Link</Label>
          <Input id="googleMapsLink" name="googleMapsLink" defaultValue={defaults.googleMapsLink} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="googleOpeningHours">Offnungszeiten</Label>
          <Textarea id="googleOpeningHours" name="googleOpeningHours" defaultValue={defaults.googleOpeningHours} rows={2} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="generalEmail">Allgemeine E-Mail</Label>
          <Input id="generalEmail" name="generalEmail" defaultValue={defaults.generalEmail} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="generalPhone">Allgemeines Telefon</Label>
          <Input id="generalPhone" name="generalPhone" defaultValue={defaults.generalPhone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supportEmail">Support E-Mail</Label>
          <Input id="supportEmail" name="supportEmail" defaultValue={defaults.supportEmail} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salesEmail">Vertrieb E-Mail</Label>
          <Input id="salesEmail" name="salesEmail" defaultValue={defaults.salesEmail} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Unternehmensbeschreibung</Label>
          <Textarea id="description" name="description" defaultValue={defaults.description} rows={4} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="shortPitch">Kurzpitch</Label>
          <Input id="shortPitch" name="shortPitch" defaultValue={defaults.shortPitch} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="usp">USP (eine Zeile pro Punkt)</Label>
          <Textarea id="usp" name="usp" defaultValue={defaults.usp} rows={3} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="positioning">Positionierung</Label>
          <Input id="positioning" name="positioning" defaultValue={defaults.positioning} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessModel">Geschaftsmodell</Label>
          <Input id="businessModel" name="businessModel" defaultValue={defaults.businessModel} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetMarket">Zielmarkt</Label>
          <Input id="targetMarket" name="targetMarket" defaultValue={defaults.targetMarket} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceLevel">Preisniveau</Label>
          <Input id="priceLevel" name="priceLevel" defaultValue={defaults.priceLevel} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="marketPosition">Marktposition</Label>
          <Input id="marketPosition" name="marketPosition" defaultValue={defaults.marketPosition} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avgLoadTime">Ladezeit (ms)</Label>
          <Input id="avgLoadTime" name="avgLoadTime" defaultValue={defaults.avgLoadTime} type="number" />
        </div>
        <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
          <input id="sslEnabled" name="sslEnabled" type="checkbox" defaultChecked={defaults.sslEnabled} />
          SSL aktiv
        </label>
        <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
          <input id="websiteReachable" name="websiteReachable" type="checkbox" defaultChecked={defaults.websiteReachable} />
          Website erreichbar
        </label>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="socialMedia">Social Media JSON / Freitext</Label>
          <Textarea id="socialMedia" name="socialMedia" defaultValue={defaults.socialMedia} rows={3} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="techStack">Tech-Stack JSON / Freitext</Label>
          <Textarea id="techStack" name="techStack" defaultValue={defaults.techStack} rows={3} />
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
