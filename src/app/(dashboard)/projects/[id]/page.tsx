import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProjectDetailView } from "../_components/project-detail-view"
import type { ActivityItem } from "../_components/activity-feed"

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      company: { select: { id: true, name: true, website: true, industry: true } },
      jobs: { orderBy: { createdAt: "desc" }, select: { id: true, status: true, createdAt: true } },
      assets: true,
      todos: true,
      milestones: { orderBy: [{ sortOrder: "asc" }, { dueAt: "asc" }] },
      offers: true,
      invoices: true,
    },
  })
  if (!project) notFound()

  const [designs, templates, auditLogs, wizardData] = await Promise.all([
    prisma.design.findMany({ orderBy: { createdAt: "desc" }, take: 20, select: { id: true, name: true } }),
    prisma.template.findMany({ orderBy: { createdAt: "desc" }, take: 20, select: { id: true, name: true } }),
    prisma.auditLog.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    Promise.all([
      prisma.company.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
      prisma.project.findMany({
        select: { id: true, name: true, companyId: true, primaryCTA: true },
        orderBy: { name: "asc" },
      }),
      prisma.template.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
      prisma.design.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    ]),
  ])

  const [companies, projects, wizardTemplates, wizardDesigns] = wizardData

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart.getTime() + 86400000)
  const openTodos = project.todos.filter((t) => t.status !== "done" && t.status !== "cancelled")
  const dueToday = openTodos.filter(
    (t) => t.dueAt && t.dueAt >= todayStart && t.dueAt < todayEnd
  ).length
  const overdue = openTodos.filter((t) => t.dueAt && t.dueAt < todayStart).length

  const nextMilestone = project.milestones.find(
    (m) => m.status !== "done"
  )
  const doneMilestones = project.milestones.filter((m) => m.status === "done").length

  const offeredAccepted = project.offers
    .filter((o) => o.status === "accepted")
    .reduce((sum, o) => sum + (o.amount ?? 0), 0)
  const invoiced = project.invoices.reduce((sum, i) => sum + (i.amount ?? 0), 0)
  const paid = project.invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + (i.amount ?? 0), 0)
  const openAmount = invoiced - paid

  const activities: ActivityItem[] = auditLogs.map((log) => ({
    id: log.id,
    summary: log.summary,
    entityType: log.entityType,
    entityId: log.entityId,
    createdAt: log.createdAt.toISOString(),
    action: log.action,
  }))

  const technologiesDisplay =
    project.technologies != null
      ? (() => {
          try {
            const arr = JSON.parse(project.technologies) as string[]
            return Array.isArray(arr) ? arr.join(", ") : project.technologies
          } catch {
            return project.technologies
          }
        })()
      : null

  const preferredTemplateCategoriesDisplay =
    project.preferredTemplateCategories != null
      ? (() => {
          try {
            const arr = JSON.parse(project.preferredTemplateCategories) as string[]
            return Array.isArray(arr) ? arr.join(", ") : project.preferredTemplateCategories
          } catch {
            return project.preferredTemplateCategories
          }
        })()
      : null

  const overview = {
    infoRows: [
      { label: "Unternehmen", value: project.company.name },
      { label: "Webseite", value: project.company.website ?? null },
      { label: "Branche", value: project.company.industry ?? null },
      { label: "Status", value: project.status },
      { label: "Zielsetzung", value: project.objective },
      { label: "Zielgruppe", value: project.targetAudience },
      { label: "Projektbeschreibung", value: project.description },
      { label: "Slug", value: project.slug },
      { label: "Primärer CTA", value: project.primaryCTA },
      { label: "Verantwortlich", value: project.owner },
      { label: "Ansprechpartner", value: project.contactPerson ?? null },
      {
        label: "Startdatum",
        value: project.startDate ? new Date(project.startDate).toLocaleDateString("de-DE") : null,
      },
      {
        label: "Zieltermin",
        value: project.endDate ? new Date(project.endDate).toLocaleDateString("de-DE") : null,
      },
      { label: "Technologien", value: technologiesDisplay },
      {
        label: "Zuweisung Workflows",
        value: project.workflowAssignmentEnabled === true ? "Ja" : project.workflowAssignmentEnabled === false ? "Nein" : null,
      },
      { label: "Templategruppen", value: preferredTemplateCategoriesDisplay },
    ],
    todoCounts: {
      open: openTodos.length,
      dueToday,
      overdue,
    },
    milestoneSummary: {
      nextTitle: nextMilestone?.title ?? null,
      nextDue: nextMilestone?.dueAt?.toISOString() ?? null,
      done: doneMilestones,
      total: project.milestones.length,
    },
    financeSummary: {
      offeredAccepted,
      invoiced,
      open: Math.round(openAmount * 100) / 100,
    },
    activities,
    lastJob: project.jobs[0]
      ? {
          id: project.jobs[0].id,
          status: project.jobs[0].status,
          createdAt: project.jobs[0].createdAt.toISOString(),
        }
      : null,
  }

  return (
    <ProjectDetailView
      project={{
        id: project.id,
        name: project.name,
        slug: project.slug,
        description: project.description,
        objective: project.objective,
        targetAudience: project.targetAudience,
        primaryCTA: project.primaryCTA,
        status: project.status,
        owner: project.owner,
        startDate: project.startDate?.toISOString() ?? null,
        endDate: project.endDate?.toISOString() ?? null,
        technologies: project.technologies,
        previewUrl: project.previewUrl,
        company: project.company,
        jobs: project.jobs.map((j) => ({ ...j, createdAt: j.createdAt.toISOString() })),
        assets: project.assets.map((a) => ({
          id: a.id,
          type: a.type,
          storageKey: a.storageKey,
          projectId: a.projectId,
          jobId: a.jobId,
          publicUrl: a.publicUrl,
          meta: a.meta,
          createdAt: a.createdAt.toISOString(),
        })),
      }}
      overview={overview}
      wizardData={{
        companies,
        projects,
        templates: wizardTemplates,
        designs: wizardDesigns,
      }}
      designs={designs}
      templates={templates}
    />
  )
}
