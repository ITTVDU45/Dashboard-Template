"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface DescriptionTabProps {
  companyId: string
  initialDescription: string | null
  initialShortPitch: string | null
  initialUsp: string[]
  initialPositioning: string | null
  initialBusinessModel: string | null
  initialTargetMarket: string | null
  initialPriceLevel: string | null
  initialMarketPosition: string | null
  onGenerate: () => void
}

export function DescriptionTab({
  companyId,
  initialDescription,
  initialShortPitch,
  initialUsp,
  initialPositioning,
  initialBusinessModel,
  initialTargetMarket,
  initialPriceLevel,
  initialMarketPosition,
  onGenerate,
}: DescriptionTabProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [description, setDescription] = useState(initialDescription ?? "")
  const [shortPitch, setShortPitch] = useState(initialShortPitch ?? "")
  const [usp, setUsp] = useState(initialUsp.join("\n"))
  const [positioning, setPositioning] = useState(initialPositioning ?? "")
  const [businessModel, setBusinessModel] = useState(initialBusinessModel ?? "")
  const [targetMarket, setTargetMarket] = useState(initialTargetMarket ?? "")
  const [priceLevel, setPriceLevel] = useState(initialPriceLevel ?? "")
  const [marketPosition, setMarketPosition] = useState(initialMarketPosition ?? "")

  async function save() {
    setIsSaving(true)
    await fetch(`/api/companies/${companyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description,
        shortPitch,
        usp: usp.split("\n").map((x) => x.trim()).filter(Boolean),
        positioning,
        businessModel,
        targetMarket,
        priceLevel,
        marketPosition,
      }),
    })
    setIsSaving(false)
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Generierte Beschreibung</CardTitle>
          <Badge variant="outline">KI generiert</Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={8} />
          <div className="flex gap-2">
            <Button onClick={onGenerate} variant="outline">Neu generieren</Button>
            <Button onClick={save} disabled={isSaving}>{isSaving ? "Speichern..." : "Speichern"}</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
        <CardHeader><CardTitle>Kurzprofil</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>1-Satz Pitch</Label>
            <Input value={shortPitch} onChange={(e) => setShortPitch(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>USP (eine Zeile pro Punkt)</Label>
            <Textarea value={usp} onChange={(e) => setUsp(e.target.value)} rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Positionierung</Label>
            <Input value={positioning} onChange={(e) => setPositioning(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
        <CardHeader><CardTitle>Interne Analyse</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Geschaftsmodell</Label>
            <Input value={businessModel} onChange={(e) => setBusinessModel(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Zielmarkt</Label>
            <Input value={targetMarket} onChange={(e) => setTargetMarket(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Preisniveau</Label>
            <Input value={priceLevel} onChange={(e) => setPriceLevel(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Marktposition</Label>
            <Input value={marketPosition} onChange={(e) => setMarketPosition(e.target.value)} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
