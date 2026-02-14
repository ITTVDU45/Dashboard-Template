"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/common/status-badge"
import { CompanyTabsBar, type CompanyTabValue } from "./company-tabs-bar"
import { CompanyOverviewTab } from "./overview-tab"
import { DescriptionTab } from "./description-tab"
import { ServicesTab, type CompanyServiceItem } from "./services-tab"
import { ContactsTab, type CompanyContactItem } from "./contacts-tab"
import { OnlinePresenceTab } from "./online-presence-tab"

export interface CompanyDetailData {
  id: string
  name: string
  website: string | null
  industry: string | null
  brandTone: string | null
  colors: string | null
  logoUrl: string | null
  notes: string | null
  employeeCount: number | null
  foundingYear: number | null
  websiteSystem: string | null
  googleRating: number | null
  googleReviewCount: number | null
  location: string | null
  description: string | null
  shortPitch: string | null
  usp: string | null
  positioning: string | null
  businessModel: string | null
  targetMarket: string | null
  priceLevel: string | null
  marketPosition: string | null
  googleAddress: string | null
  googleMapsLink: string | null
  googleOpeningHours: string | null
  sslEnabled: boolean | null
  websiteReachable: boolean | null
  avgLoadTime: number | null
  socialMedia: string | null
  techStack: string | null
  generalEmail: string | null
  generalPhone: string | null
  supportEmail: string | null
  salesEmail: string | null
  projects: Array<{ id: string; name: string }>
  jobs: Array<{ id: string; status: string; project: { id: string; name: string } }>
  services: CompanyServiceItem[]
  contacts: CompanyContactItem[]
}

interface CompanyDetailViewProps {
  company: CompanyDetailData
}

function parseUsp(value: string | null): string[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed.filter((entry) => typeof entry === "string")
  } catch {}
  return value.split("\n").map((entry) => entry.trim()).filter(Boolean)
}

export function CompanyDetailView({ company }: CompanyDetailViewProps) {
  const router = useRouter()
  const [tab, setTab] = useState<CompanyTabValue>("overview")
  const [isActionLoading, setIsActionLoading] = useState(false)

  async function runAction(endpoint: string) {
    setIsActionLoading(true)
    await fetch(`/api/companies/${company.id}/${endpoint}`, { method: "POST" })
    setIsActionLoading(false)
    router.refresh()
  }

  return (
    <CompanyTabsBar value={tab} onValueChange={setTab}>
      <TabsContent value="overview" className="mt-4">
        <div className="space-y-4">
          <CompanyOverviewTab
            industry={company.industry}
            employeeCount={company.employeeCount}
            foundingYear={company.foundingYear}
            websiteSystem={company.websiteSystem}
            googleRating={company.googleRating}
            googleReviewCount={company.googleReviewCount}
            location={company.location}
            websiteReachable={company.websiteReachable}
            sslEnabled={company.sslEnabled}
            avgLoadTime={company.avgLoadTime}
            isActionLoading={isActionLoading}
            onAnalyzeWebsite={() => runAction("analyze-website")}
            onGenerateDescription={() => runAction("generate-description")}
            onExtractServices={() => runAction("extract-services")}
            onSyncGoogle={() => runAction("analyze-website")}
          />
          <DescriptionTab
            companyId={company.id}
            initialDescription={company.description}
            initialShortPitch={company.shortPitch}
            initialUsp={parseUsp(company.usp)}
            initialPositioning={company.positioning}
            initialBusinessModel={company.businessModel}
            initialTargetMarket={company.targetMarket}
            initialPriceLevel={company.priceLevel}
            initialMarketPosition={company.marketPosition}
            onGenerate={() => runAction("generate-description")}
          />
          <ContactsTab companyId={company.id} initialContacts={company.contacts} />
        </div>
      </TabsContent>
      <TabsContent value="services" className="mt-4">
        <ServicesTab companyId={company.id} initialServices={company.services} onExtractServices={() => runAction("extract-services")} />
      </TabsContent>
      <TabsContent value="onlinePresence" className="mt-4">
        <OnlinePresenceTab
          companyId={company.id}
          googleAddress={company.googleAddress}
          googleMapsLink={company.googleMapsLink}
          googleRating={company.googleRating}
          googleReviewCount={company.googleReviewCount}
          googleOpeningHours={company.googleOpeningHours}
          websiteSystem={company.websiteSystem}
          socialMediaRaw={company.socialMedia}
          techStackRaw={company.techStack}
          onAnalyzeTech={() => runAction("detect-tech")}
        />
      </TabsContent>
      <TabsContent value="projects" className="mt-4">
        <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
          <CardHeader><CardTitle>Projekte</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {company.projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="block rounded-lg border p-3 hover:bg-muted/40">
                {project.name}
              </Link>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="jobs" className="mt-4">
        <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
          <CardHeader><CardTitle>Jobs</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {company.jobs.map((job) => (
              <Link key={job.id} href={`/workflows/${job.id}`} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40">
                <span>{job.project.name}</span>
                <StatusBadge status={job.status as "queued" | "running" | "needs_review" | "done" | "failed"} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings" className="mt-4">
        <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
          <CardHeader><CardTitle>Einstellungen</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Bearbeitung von Basisdaten erfolgt uber das Unternehmensformular.</p>
            <Link className="text-primary underline-offset-4 hover:underline" href={`/companies/${company.id}/edit`}>
              Unternehmen bearbeiten
            </Link>
          </CardContent>
        </Card>
      </TabsContent>
    </CompanyTabsBar>
  )
}
