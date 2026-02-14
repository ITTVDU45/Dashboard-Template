"use client"

import { useMemo, useState } from "react"
import { z } from "zod"
import { integrationSettingSchema } from "@/lib/validations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SettingsFormsProps {
  initialSettings: Record<string, Record<string, string>>
}

type FormValues = Record<string, string>

export function SettingsForms({ initialSettings }: SettingsFormsProps) {
  const [error, setError] = useState("")
  const [isLoadingProvider, setIsLoadingProvider] = useState<string | null>(null)
  const [forms, setForms] = useState<Record<string, FormValues>>({
    github: {
      repo: initialSettings.github?.repo || "",
      token: initialSettings.github?.token || "",
      webhookSecret: initialSettings.github?.webhookSecret || ""
    },
    openai: {
      apiKey: initialSettings.openai?.apiKey || "",
      model: initialSettings.openai?.model || "gpt-4.1-mini"
    },
    minio: {
      endpoint: initialSettings.minio?.endpoint || "",
      accessKey: initialSettings.minio?.accessKey || "",
      secretKey: initialSettings.minio?.secretKey || "",
      bucket: initialSettings.minio?.bucket || "",
      publicBaseUrl: initialSettings.minio?.publicBaseUrl || ""
    },
    telegram: {
      botToken: initialSettings.telegram?.botToken || "",
      chatId: initialSettings.telegram?.chatId || ""
    },
    system: {
      auditRetentionDays: initialSettings.system?.auditRetentionDays || "30"
    }
  })

  const sections = useMemo(
    () => [
      { id: "github", title: "GitHub", fields: ["repo", "token", "webhookSecret"] },
      { id: "openai", title: "OpenAI", fields: ["apiKey", "model"] },
      { id: "minio", title: "MinIO", fields: ["endpoint", "accessKey", "secretKey", "bucket", "publicBaseUrl"] },
      { id: "telegram", title: "Telegram", fields: ["botToken", "chatId"] }
    ],
    []
  )

  async function saveProvider(provider: "github" | "openai" | "minio" | "telegram" | "system") {
    setError("")
    setIsLoadingProvider(provider)
    const payload = { provider, config: forms[provider] }
    const validated = integrationSettingSchema.safeParse(payload)
    if (!validated.success) {
      setIsLoadingProvider(null)
      setError(z.prettifyError(validated.error))
      return
    }

    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated.data)
    })
    setIsLoadingProvider(null)
    if (!response.ok) setError(`Speichern fehlgeschlagen für ${provider}.`)
  }

  function onInputChange(provider: string, key: string, value: string) {
    setForms((prev) => ({ ...prev, [provider]: { ...prev[provider], [key]: value } }))
  }

  function renderIntegrationCard(provider: { id: string; title: string; fields: string[] }) {
    return (
      <Card key={provider.id}>
        <CardHeader><CardTitle>{provider.title}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {provider.fields.map((field) => (
            <div className="space-y-1.5" key={field}>
              <Label htmlFor={`${provider.id}-${field}`}>{field}</Label>
              <Input
                id={`${provider.id}-${field}`}
                value={forms[provider.id]?.[field] || ""}
                onChange={(event) => onInputChange(provider.id, field, event.target.value)}
                placeholder={`${field} (ENV-Platzhalter)`}
              />
            </div>
          ))}
          <Button onClick={() => saveProvider(provider.id as "github" | "openai" | "minio" | "telegram")} disabled={isLoadingProvider === provider.id}>
            {isLoadingProvider === provider.id ? "Speichern..." : "Speichern"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="integrations">
      <TabsList>
        <TabsTrigger value="integrations">Integrationen</TabsTrigger>
        <TabsTrigger value="system">System</TabsTrigger>
      </TabsList>

      <TabsContent value="integrations" className="space-y-4">
        {sections.map((section) => renderIntegrationCard(section))}
      </TabsContent>

      <TabsContent value="system">
        <Card>
          <CardHeader><CardTitle>System</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="auditRetentionDays">Audit-Log Aufbewahrungstage</Label>
              <Input
                id="auditRetentionDays"
                value={forms.system.auditRetentionDays}
                onChange={(event) => onInputChange("system", "auditRetentionDays", event.target.value)}
              />
            </div>
            <Button onClick={() => saveProvider("system")} disabled={isLoadingProvider === "system"}>
              {isLoadingProvider === "system" ? "Speichern..." : "Speichern"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </Tabs>
  )
}
