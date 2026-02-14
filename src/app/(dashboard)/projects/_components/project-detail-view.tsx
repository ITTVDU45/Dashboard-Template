"use client"

import { useState, useCallback } from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ProjectHeaderCard, type AddDrawerType } from "./project-header-card"
import { TabsBarWithMore, type ProjectTabValue } from "./tabs-bar-with-more"
import { OverviewTab } from "./overview-tab"
import { StartWorkflowWizard } from "@/components/workflows/start-workflow-wizard"
import type { ActivityItem } from "./activity-feed"
import { ActivitiesTab } from "./activities-tab"
import { TodosTab } from "./todos-tab"
import { ProjectFileExplorer } from "@/app/(dashboard)/assets/_components/project-file-explorer"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/common/status-badge"

export interface ProjectDetailProject {
  id: string
  name: string
  slug: string
  description: string | null
  objective: string | null
  targetAudience: string | null
  primaryCTA: string | null
  status: string
  owner: string | null
  startDate: string | null
  endDate: string | null
  technologies: string | null
  previewUrl: string | null
  company: { id: string; name: string; website?: string | null; industry?: string | null }
  jobs: Array<{ id: string; status: string; createdAt: string }>
  assets: Array<{
    id: string
    type: string
    storageKey: string
    projectId: string | null
    jobId: string | null
    publicUrl: string | null
    meta: string | null
    createdAt: string
  }>
}

export interface OverviewData {
  infoRows: { label: string; value: React.ReactNode }[]
  todoCounts: { open: number; dueToday: number; overdue: number }
  milestoneSummary: { nextTitle: string | null; nextDue: string | null; done: number; total: number }
  financeSummary: { offeredAccepted: number; invoiced: number; open: number }
  activities: ActivityItem[]
  lastJob: { id: string; status: string; createdAt: string } | null
}

export interface WizardData {
  companies: Array<{ id: string; name: string }>
  projects: Array<{ id: string; name: string; companyId: string; primaryCTA: string | null }>
  templates: Array<{ id: string; name: string }>
  designs: Array<{ id: string; name: string }>
}

interface ProjectDetailViewProps {
  project: ProjectDetailProject
  overview: OverviewData
  wizardData: WizardData
  designs: Array<{ id: string; name: string }>
  templates: Array<{ id: string; name: string }>
}

export function ProjectDetailView({
  project,
  overview,
  wizardData,
  designs,
  templates,
}: ProjectDetailViewProps) {
  const [tab, setTab] = useState<ProjectTabValue>("overview")
  const [workflowOpen, setWorkflowOpen] = useState(false)
  const [addDrawerType, setAddDrawerType] = useState<AddDrawerType | null>(null)

  const handleAdd = useCallback((type: AddDrawerType) => {
    if (type === "todo") setTab("todos")
    else if (type === "note") setTab("activities")
    else if (type === "milestone") setTab("milestones")
    else if (type === "offer" || type === "invoice") setTab("finances")
    setAddDrawerType(type)
  }, [])

  return (
    <div className="space-y-6">
      <ProjectHeaderCard
        project={{
          id: project.id,
          name: project.name,
          slug: project.slug,
          previewUrl: project.previewUrl,
        }}
        companyName={project.company.name}
        onStartWorkflow={() => setWorkflowOpen(true)}
        onAdd={handleAdd}
      />
      <TabsBarWithMore value={tab} onValueChange={setTab}>
        <TabsContent value="overview" className="mt-4">
          <OverviewTab
            projectId={project.id}
            infoRows={overview.infoRows}
            todoCounts={overview.todoCounts}
            milestoneSummary={overview.milestoneSummary}
            financeSummary={overview.financeSummary}
            activities={overview.activities}
            lastJob={overview.lastJob}
            onSwitchTab={setTab}
          />
        </TabsContent>
        <TabsContent value="activities" className="mt-4">
          <ActivitiesTab projectId={project.id} />
        </TabsContent>
        <TabsContent value="todos" className="mt-4">
          <TodosTab
            projectId={project.id}
            openCreateDrawer={addDrawerType === "todo"}
            onOpenCreateDrawer={() => setAddDrawerType((t) => (t === "todo" ? null : t))}
          />
        </TabsContent>
        <TabsContent value="finances" className="mt-4">
          <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
            <CardHeader><CardTitle>Finanzen</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Angebote & Rechnungen – wird im nächsten Schritt eingebunden.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="jobs" className="mt-4">
          <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
            <CardHeader><CardTitle>Jobs</CardTitle></CardHeader>
            <CardContent className="space-y-2 pt-6">
              {project.jobs.length === 0 ? (
                <p className="text-sm text-muted-foreground">Noch keine Jobs.</p>
              ) : (
                project.jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/workflows/${job.id}`}
                    className="flex items-center justify-between rounded border p-3 transition-colors hover:bg-muted/40"
                  >
                    <span className="text-sm font-medium">{job.id}</span>
                    <StatusBadge status={job.status as "queued" | "running" | "needs_review" | "done" | "failed"} />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assets" className="mt-4">
          <ProjectFileExplorer
            assets={project.assets.map((a) => ({
              id: a.id,
              type: a.type,
              storageKey: a.storageKey,
              projectId: a.projectId,
              jobId: a.jobId,
              publicUrl: a.publicUrl,
              meta: a.meta,
              createdAt: a.createdAt,
            }))}
          />
        </TabsContent>
        <TabsContent value="designs" className="mt-4">
          <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
            <CardHeader><CardTitle>Designs</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {designs.map((d) => (
                <Link key={d.id} href={`/designs/${d.id}`} className="block rounded border p-3 hover:bg-muted/40">
                  {d.name}
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="templates" className="mt-4">
          <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
            <CardHeader><CardTitle>Templates</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {templates.map((t) => (
                <Link key={t.id} href={`/templates/${t.id}`} className="block rounded border p-3 hover:bg-muted/40">
                  {t.name}
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="milestones" className="mt-4">
          <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
            <CardHeader><CardTitle>Meilensteine</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Timeline-View – wird im nächsten Schritt eingebunden.
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
            <CardContent className="pt-6 text-sm text-muted-foreground">
              MVP: Verwende das Bearbeitungsformular für alle Projekteinstellungen.
            </CardContent>
          </Card>
        </TabsContent>
      </TabsBarWithMore>

      <Sheet open={workflowOpen} onOpenChange={setWorkflowOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Workflow starten</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <StartWorkflowWizard
              companies={wizardData.companies}
              projects={wizardData.projects}
              templates={wizardData.templates}
              designs={wizardData.designs}
            />
          </div>
        </SheetContent>
      </Sheet>

      {addDrawerType ? (
        <Sheet open={!!addDrawerType} onOpenChange={(open) => !open && setAddDrawerType(null)}>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>
                {addDrawerType === "todo" && "To-do erstellen"}
                {addDrawerType === "note" && "Notiz hinzufügen"}
                {addDrawerType === "milestone" && "Meilenstein erstellen"}
                {addDrawerType === "offer" && "Angebot erstellen"}
                {addDrawerType === "invoice" && "Rechnung erstellen"}
              </SheetTitle>
            </SheetHeader>
            <p className="mt-4 text-sm text-muted-foreground">
              Drawer-Formulare werden in den jeweiligen Tab-Schritten eingebunden.
            </p>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  )
}
