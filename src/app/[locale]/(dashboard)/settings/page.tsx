"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PageShell } from "@/components/layout/page-shell";
import { DataTable, type Column } from "@/components/common/data-table";
import { LoadingState } from "@/components/common/loading-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Webhook, User, Save, Plus, Eye, EyeOff, Copy } from "lucide-react";
import { toast } from "sonner";
import * as api from "@/lib/mock/api";
import type { Webhook as WebhookType, UserProfile } from "@/types/domain";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const tLang = useTranslations("language");
  const locale = useLocale();
  const [loading, setLoading] = useState(true);
  const [webhooks, setWebhooks] = useState<WebhookType[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    usageWarnings: true,
    billingReminders: true,
    systemUpdates: false,
    marketingEmails: false,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [webhooksRes, profileRes] = await Promise.all([
          api.getWebhooks(),
          api.getUserProfile(),
        ]);
        setWebhooks(webhooksRes.data);
        setProfile(profileRes.data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleToggleWebhook(id: string) {
    try {
      await api.toggleWebhook(id);
      setWebhooks((prev) =>
        prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
      );
      toast.success(tCommon("status.success"));
    } catch {
      toast.error(tCommon("states.error"));
    }
  }

  async function handleSaveProfile() {
    setSaving(true);
    try {
      await api.updateUserProfile(profile!);
      toast.success(tCommon("status.success"));
    } catch {
      toast.error(tCommon("states.error"));
    } finally {
      setSaving(false);
    }
  }

  function toggleSecretVisibility(id: string) {
    setVisibleSecrets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success(tCommon("status.success"));
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return tCommon("time.never");
    return new Date(dateStr).toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const webhookColumns: Column<WebhookType>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => <span className="font-medium text-foreground">{row.name}</span>,
    },
    {
      key: "url",
      header: "URL",
      cell: (row) => (
        <code className="text-xs bg-muted/50 px-2 py-1 rounded truncate max-w-[200px] block text-muted-foreground border border-border">
          {row.url}
        </code>
      ),
    },
    {
      key: "events",
      header: "Events",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.events.slice(0, 2).map((e) => (
            <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
          ))}
          {row.events.length > 2 && (
            <Badge variant="outline" className="text-xs">+{row.events.length - 2}</Badge>
          )}
        </div>
      ),
    },
    {
      key: "active",
      header: "Status",
      cell: (row) => (
        <Switch checked={row.active} onCheckedChange={() => handleToggleWebhook(row.id)} />
      ),
    },
    {
      key: "lastTriggered",
      header: "Last triggered",
      cell: (row) => <span className="text-muted-foreground text-sm">{formatDate(row.lastTriggeredAt)}</span>,
    },
  ];

  if (loading) {
    return (
      <PageShell title={t("title")} description={t("description")}>
        <LoadingState rows={6} />
      </PageShell>
    );
  }

  return (
    <PageShell title={t("title")} description={t("description")}>
      <Tabs defaultValue="notifications">
        <TabsList>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            {t("notifications.title")}
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            {t("preferences.title")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("notifications.email")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "emailAlerts", label: t("notifications.security") },
                { key: "usageWarnings", label: t("notifications.usage") },
                { key: "billingReminders", label: "Billing" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="font-medium text-foreground">{item.label}</div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-6 space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => toast.info("Coming soon...")}>
              <Plus className="h-4 w-4 mr-2" />
              {tCommon("actions.add")} Webhook
            </Button>
          </div>

          <DataTable columns={webhookColumns} data={webhooks} />

          {webhooks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-foreground">Webhook Secrets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {webhooks.map((wh) => (
                    <div key={wh.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                      <div>
                        <div className="font-medium text-sm text-foreground">{wh.name}</div>
                        <code className="text-xs text-muted-foreground">
                          {visibleSecrets.has(wh.id) ? wh.secret : "••••••••••••"}
                        </code>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleSecretVisibility(wh.id)}>
                          {visibleSecrets.has(wh.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(wh.secret)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="profile" className="mt-6 space-y-6">
          {profile && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Name</Label>
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile((p) => p && { ...p, name: e.target.value })}
                        className="bg-muted/50 border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">E-Mail</Label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile((p) => p && { ...p, email: e.target.value })}
                        className="bg-muted/50 border-border"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">{t("preferences.language")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">{t("preferences.language")}</Label>
                      <Select value={profile.language} onValueChange={(v) => setProfile((p) => p && { ...p, language: v })}>
                        <SelectTrigger className="bg-muted/50 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card/95 backdrop-blur-xl border-glass-border">
                          <SelectItem value="de">{tLang("de")}</SelectItem>
                          <SelectItem value="en">{tLang("en")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">{t("preferences.timezone")}</Label>
                      <Select value={profile.timezone} onValueChange={(v) => setProfile((p) => p && { ...p, timezone: v })}>
                        <SelectTrigger className="bg-muted/50 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card/95 backdrop-blur-xl border-glass-border">
                          <SelectItem value="Europe/Berlin">Berlin (UTC+1)</SelectItem>
                          <SelectItem value="Europe/London">London (UTC+0)</SelectItem>
                          <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? tCommon("states.loading") : tCommon("actions.save")}
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
