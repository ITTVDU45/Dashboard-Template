"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { InfoCard } from "./info-card"
import { KpiCardsRow } from "./kpi-cards-row"
import { ActivityFeed, type ActivityItem } from "./activity-feed"
import type { ProjectTabValue } from "./tabs-bar-with-more"

interface TodoCounts {
  open: number
  dueToday: number
  overdue: number
}

interface MilestoneSummary {
  nextTitle: string | null
  nextDue: string | null
  done: number
  total: number
}

interface FinanceSummary {
  offeredAccepted: number
  invoiced: number
  open: number
}

interface JobSummary {
  id: string
  status: string
  createdAt: string
}

interface OverviewTabProps {
  projectId: string
  infoRows: { label: string; value: React.ReactNode }[]
  todoCounts: TodoCounts
  milestoneSummary: MilestoneSummary
  financeSummary: FinanceSummary
  activities: ActivityItem[]
  lastJob: JobSummary | null
  onSwitchTab: (tab: ProjectTabValue) => void
}

export function OverviewTab({
  projectId,
  infoRows,
  todoCounts,
  milestoneSummary,
  financeSummary,
  activities,
  lastJob,
  onSwitchTab,
}: OverviewTabProps) {
  const getActivityHref = (item: ActivityItem): string | null => {
    if (item.entityType === "Todo") return `/projects/${projectId}?tab=todos`
    if (item.entityType === "Milestone") return `/projects/${projectId}?tab=milestones`
    if (item.entityType === "Offer" || item.entityType === "Invoice") return `/projects/${projectId}?tab=finances`
    if (item.entityType === "Job") return `/workflows/${item.entityId}`
    if (item.entityType === "Asset") return `/projects/${projectId}?tab=assets`
    return null
  }

  return (
    <div className="space-y-6">
      <InfoCard rows={infoRows} columns={2} />
      <KpiCardsRow
        items={[
          {
            title: "Aufgaben",
            subtitle: `${todoCounts.open} offen · ${todoCounts.dueToday} heute · ${todoCounts.overdue} überfällig`,
            value: `${todoCounts.open}`,
            actionLabel: "To-dos öffnen",
            onAction: () => onSwitchTab("todos"),
          },
          {
            title: "Meilensteine",
            subtitle: milestoneSummary.nextTitle
              ? `Nächster: ${milestoneSummary.nextTitle}${milestoneSummary.nextDue ? ` (${new Date(milestoneSummary.nextDue).toLocaleDateString("de-DE")})` : ""}`
              : undefined,
            value: `${milestoneSummary.done}/${milestoneSummary.total}`,
            actionLabel: "Timeline öffnen",
            onAction: () => onSwitchTab("milestones"),
          },
          {
            title: "Finanzen",
            subtitle: `Angebote (angen.): ${financeSummary.offeredAccepted.toLocaleString("de-DE")} · Rechn.: ${financeSummary.invoiced.toLocaleString("de-DE")}`,
            value: `${financeSummary.open.toLocaleString("de-DE", { minimumFractionDigits: 2 })} € offen`,
            actionLabel: "Finanzen öffnen",
            onAction: () => onSwitchTab("finances"),
          },
        ]}
      />
      {lastJob ? (
        <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Letzter Job</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Link
              href={`/workflows/${lastJob.id}`}
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <span className="text-sm font-medium">{lastJob.id}</span>
              <span className="text-xs text-muted-foreground">{lastJob.status}</span>
            </Link>
            <p className="mt-2 text-xs text-muted-foreground">
              Gestartet: {new Date(lastJob.createdAt).toLocaleString("de-DE")}
            </p>
          </CardContent>
        </Card>
      ) : null}
      <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Letzte Aktivitäten</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ActivityFeed
            items={activities}
            projectId={projectId}
            getHref={getActivityHref}
            maxItems={5}
          />
        </CardContent>
      </Card>
    </div>
  )
}
