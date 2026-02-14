"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CompanyOverviewTabProps {
  industry: string | null
  employeeCount: number | null
  foundingYear: number | null
  websiteSystem: string | null
  googleRating: number | null
  googleReviewCount: number | null
  location: string | null
  websiteReachable: boolean | null
  sslEnabled: boolean | null
  avgLoadTime: number | null
  isActionLoading: boolean
  onAnalyzeWebsite: () => void
  onGenerateDescription: () => void
  onExtractServices: () => void
  onSyncGoogle: () => void
}

function statusLabel(value: boolean | null, trueLabel: string, falseLabel: string) {
  if (value === true) return trueLabel
  if (value === false) return falseLabel
  return "Unbekannt"
}

export function CompanyOverviewTab(props: CompanyOverviewTabProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle>Unternehmens-KPI</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
          <p><span className="text-muted-foreground">Branche:</span> {props.industry ?? "-"}</p>
          <p><span className="text-muted-foreground">Mitarbeiter:</span> {props.employeeCount ?? "-"}</p>
          <p><span className="text-muted-foreground">Gegrundet:</span> {props.foundingYear ?? "-"}</p>
          <p><span className="text-muted-foreground">Website-System:</span> {props.websiteSystem ?? "-"}</p>
          <p>
            <span className="text-muted-foreground">Google Rating:</span>{" "}
            {props.googleRating ? `${props.googleRating.toFixed(1)} (${props.googleReviewCount ?? 0})` : "-"}
          </p>
          <p><span className="text-muted-foreground">Standort:</span> {props.location ?? "-"}</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
        <CardHeader>
          <CardTitle>Online-Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span>Website</span>
            <Badge variant="outline">{statusLabel(props.websiteReachable, "Erreichbar", "Offline")}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>SSL</span>
            <Badge variant="outline">{statusLabel(props.sslEnabled, "Aktiv", "Fehlt")}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Ladezeit</span>
            <span>{props.avgLoadTime ? `${props.avgLoadTime} ms` : "-"}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm lg:col-span-3">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <Button disabled={props.isActionLoading} onClick={props.onAnalyzeWebsite} variant="outline">Website analysieren</Button>
          <Button disabled={props.isActionLoading} onClick={props.onGenerateDescription} variant="outline">Beschreibung generieren</Button>
          <Button disabled={props.isActionLoading} onClick={props.onExtractServices} variant="outline">Leistungen aktualisieren</Button>
          <Button disabled={props.isActionLoading} onClick={props.onSyncGoogle} variant="outline">Google-Daten synchronisieren</Button>
        </CardContent>
      </Card>
    </div>
  )
}
