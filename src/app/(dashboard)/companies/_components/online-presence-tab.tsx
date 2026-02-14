"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface SocialItem {
  platform: string
  url: string
  status: string
  followers?: number
}

interface TechStack {
  cms?: string
  hosting?: string
  cdn?: string
  tracking?: string[]
  seoBasics?: string
}

interface OnlinePresenceTabProps {
  companyId: string
  googleAddress: string | null
  googleMapsLink: string | null
  googleRating: number | null
  googleReviewCount: number | null
  googleOpeningHours: string | null
  websiteSystem: string | null
  socialMediaRaw: string | null
  techStackRaw: string | null
  onAnalyzeTech: () => void
}

function parseSocial(value: string | null): SocialItem[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed as SocialItem[]
  } catch {
    return []
  }
}

function parseTech(value: string | null): TechStack {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value)
    if (!parsed || typeof parsed !== "object") return {}
    return parsed as TechStack
  } catch {
    return {}
  }
}

export function OnlinePresenceTab({
  companyId,
  googleAddress,
  googleMapsLink,
  googleRating,
  googleReviewCount,
  googleOpeningHours,
  websiteSystem,
  socialMediaRaw,
  techStackRaw,
  onAnalyzeTech,
}: OnlinePresenceTabProps) {
  const initialSocial = useMemo(() => parseSocial(socialMediaRaw), [socialMediaRaw])
  const initialTech = useMemo(() => parseTech(techStackRaw), [techStackRaw])

  const [address, setAddress] = useState(googleAddress ?? "")
  const [mapsLink, setMapsLink] = useState(googleMapsLink ?? "")
  const [rating, setRating] = useState(googleRating?.toString() ?? "")
  const [reviewCount, setReviewCount] = useState(googleReviewCount?.toString() ?? "")
  const [openingHours, setOpeningHours] = useState(googleOpeningHours ?? "")
  const [system, setSystem] = useState(websiteSystem ?? "")
  const [socialText, setSocialText] = useState(
    initialSocial.map((entry) => `${entry.platform}|${entry.url}|${entry.status}|${entry.followers ?? ""}`).join("\n")
  )
  const [cms, setCms] = useState(initialTech.cms ?? "")
  const [hosting, setHosting] = useState(initialTech.hosting ?? "")
  const [cdn, setCdn] = useState(initialTech.cdn ?? "")
  const [tracking, setTracking] = useState((initialTech.tracking ?? []).join(", "))
  const [seoBasics, setSeoBasics] = useState(initialTech.seoBasics ?? "")

  async function save() {
    const socialMedia = socialText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [platform, url, status, followers] = line.split("|")
        return {
          platform: (platform ?? "").trim(),
          url: (url ?? "").trim(),
          status: (status ?? "active").trim(),
          followers: followers ? Number(followers) : undefined,
        }
      })
      .filter((entry) => entry.platform && entry.url)

    await fetch(`/api/companies/${companyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        googleAddress: address,
        googleMapsLink: mapsLink,
        googleRating: rating ? Number(rating) : undefined,
        googleReviewCount: reviewCount ? Number(reviewCount) : undefined,
        googleOpeningHours: openingHours,
        websiteSystem: system,
        socialMedia,
        techStack: {
          cms,
          hosting,
          cdn,
          tracking: tracking.split(",").map((x) => x.trim()).filter(Boolean),
          seoBasics,
        },
      }),
    })
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
        <CardHeader><CardTitle>Google-Daten</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2"><Label>Adresse</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} /></div>
          <div className="space-y-2"><Label>Maps-Link</Label><Input value={mapsLink} onChange={(e) => setMapsLink(e.target.value)} /></div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2"><Label>Rating</Label><Input value={rating} onChange={(e) => setRating(e.target.value)} /></div>
            <div className="space-y-2"><Label>Bewertungen</Label><Input value={reviewCount} onChange={(e) => setReviewCount(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Offnungszeiten</Label><Textarea value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} rows={3} /></div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Website-System</CardTitle>
          <Button variant="outline" onClick={onAnalyzeTech}>Technologie analysieren</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2"><Label>System</Label><Input value={system} onChange={(e) => setSystem(e.target.value)} placeholder="WordPress, Shopify, Webflow..." /></div>
          <div className="space-y-2"><Label>CMS</Label><Input value={cms} onChange={(e) => setCms(e.target.value)} /></div>
          <div className="space-y-2"><Label>Hosting</Label><Input value={hosting} onChange={(e) => setHosting(e.target.value)} /></div>
          <div className="space-y-2"><Label>CDN</Label><Input value={cdn} onChange={(e) => setCdn(e.target.value)} /></div>
          <div className="space-y-2"><Label>Tracking (kommagetrennt)</Label><Input value={tracking} onChange={(e) => setTracking(e.target.value)} /></div>
          <div className="space-y-2"><Label>SEO-Basics</Label><Textarea value={seoBasics} onChange={(e) => setSeoBasics(e.target.value)} rows={2} /></div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-card/40 shadow-sm xl:col-span-2">
        <CardHeader><CardTitle>Social Media</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">Format pro Zeile: platform|url|status|followers</p>
          <Textarea value={socialText} onChange={(e) => setSocialText(e.target.value)} rows={6} />
          <Button onClick={save}>Speichern</Button>
        </CardContent>
      </Card>
    </div>
  )
}
