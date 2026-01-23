"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PageShell } from "@/components/layout/page-shell";
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
import { 
  Bell, User, Save, Copy, ExternalLink,
  Scale, FileText, Shield, Database, Settings2, Users,
  Crown, UserPlus, Trash2, Mail
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import * as api from "@/lib/mock/api";
import type { UserProfile } from "@/types/domain";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const tLang = useTranslations("language");
  const locale = useLocale();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    systemUpdates: false,
    marketingEmails: false,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const profileRes = await api.getUserProfile();
        setProfile(profileRes.data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">{t("notifications.title")}</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{t("preferences.title")}</span>
          </TabsTrigger>
          <TabsTrigger value="legal" className="gap-2">
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">{t("legal.title")}</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{t("members.title")}</span>
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
                { key: "systemUpdates", label: "System Updates" },
                { key: "marketingEmails", label: "Marketing E-Mails" },
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

        <TabsContent value="legal" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("legal.title")}</CardTitle>
              <p className="text-sm text-muted-foreground">{t("legal.description")}</p>
            </CardHeader>
            <CardContent className="space-y-0">
              {[
                { 
                  icon: FileText, 
                  title: t("legal.commercialTerms"), 
                  desc: t("legal.commercialTermsDesc"),
                  href: "/legal/terms" 
                },
                { 
                  icon: Shield, 
                  title: t("legal.usagePolicy"), 
                  desc: t("legal.usagePolicyDesc"),
                  href: "/legal/usage" 
                },
                { 
                  icon: Shield, 
                  title: t("legal.privacyPolicy"), 
                  desc: t("legal.privacyPolicyDesc"),
                  href: "/legal/privacy" 
                },
                { 
                  icon: Database, 
                  title: t("legal.dataRetention"), 
                  desc: t("legal.dataRetentionDesc"),
                  href: "/legal/data-retention" 
                },
                { 
                  icon: Settings2, 
                  title: t("legal.privacyChoices"), 
                  desc: t("legal.privacyChoicesDesc"),
                  href: "/legal/privacy-choices" 
                },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between py-4 border-b border-border/50 last:border-0 group cursor-pointer hover:bg-muted/30 -mx-6 px-6 transition-colors"
                  onClick={() => window.open(item.href, "_blank")}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Data Export & Deletion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("legal.dataManagement")}</CardTitle>
              <p className="text-sm text-muted-foreground">{t("legal.dataManagementDesc")}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <div className="font-medium text-foreground">{t("legal.downloadData")}</div>
                  <div className="text-sm text-muted-foreground">{t("legal.downloadDataDesc")}</div>
                </div>
                <Button variant="outline" onClick={() => toast.info(t("legal.downloadStarted"))}>
                  {t("legal.download")}
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <div className="font-medium text-foreground">{t("legal.requestDeletion")}</div>
                  <div className="text-sm text-muted-foreground">{t("legal.requestDeletionDesc")}</div>
                </div>
                <Button variant="outline" onClick={() => toast.info(t("legal.deletionRequested"))}>
                  {t("legal.requestButton")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("legal.contact")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{t("legal.contactDesc")}</p>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">E-Mail:</span> <span className="text-foreground">legal@example.com</span></div>
                <div><span className="text-muted-foreground">{t("legal.address")}:</span> <span className="text-foreground">Musterstraße 123, 10115 Berlin</span></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-6 space-y-6">
          {/* Organization Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("members.organization")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{t("members.orgName")}</Label>
                  <Input
                    value="Meine Organisation"
                    className="bg-muted/50 border-border"
                    onChange={() => {}}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">{t("members.orgId")}</Label>
                  <div className="flex gap-2">
                    <Input
                      value="f20ca876-eb75-43d9-8a32-60b44cc17076"
                      className="bg-muted/50 border-border font-mono text-sm"
                      readOnly
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText("f20ca876-eb75-43d9-8a32-60b44cc17076");
                        toast.success(tCommon("status.success"));
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast.success(t("members.saved"))}>
                  <Save className="h-4 w-4 mr-2" />
                  {tCommon("actions.save")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Members List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">{t("members.title")}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{t("members.description")}</p>
              </div>
              <Button onClick={() => toast.info(t("members.inviteSent"))}>
                <UserPlus className="h-4 w-4 mr-2" />
                {t("members.invite")}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {[
                  { name: "Max Mustermann", email: "max@example.com", role: "owner", status: "active" },
                  { name: "Anna Schmidt", email: "anna@example.com", role: "admin", status: "active" },
                  { name: "Tom Weber", email: "tom@example.com", role: "member", status: "active" },
                  { name: "Lisa Müller", email: "lisa@example.com", role: "member", status: "pending" },
                ].map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{member.name}</span>
                          {member.role === "owner" && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                          {member.status === "pending" && (
                            <Badge variant="outline" className="text-xs">{t("members.pending")}</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue={member.role} disabled={member.role === "owner"}>
                        <SelectTrigger className="w-[120px] h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">{t("members.roles.owner")}</SelectItem>
                          <SelectItem value="admin">{t("members.roles.admin")}</SelectItem>
                          <SelectItem value="member">{t("members.roles.member")}</SelectItem>
                          <SelectItem value="viewer">{t("members.roles.viewer")}</SelectItem>
                        </SelectContent>
                      </Select>
                      {member.role !== "owner" && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 text-muted-foreground hover:text-destructive"
                          onClick={() => toast.info(t("members.removed"))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Invitations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">{t("members.pendingInvites")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {[
                  { email: "new.member@example.com", role: "member", sentAt: "2025-01-22T10:00:00Z" },
                  { email: "developer@company.com", role: "admin", sentAt: "2025-01-21T14:30:00Z" },
                ].map((invite, idx) => (
                  <div key={idx} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{invite.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {t("members.sentOn")} {new Date(invite.sentAt).toLocaleDateString(locale === "de" ? "de-DE" : "en-US")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{t(`members.roles.${invite.role}`)}</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast.info(t("members.inviteResent"))}
                      >
                        {t("members.resend")}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-muted-foreground hover:text-destructive"
                        onClick={() => toast.info(t("members.inviteCancelled"))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
