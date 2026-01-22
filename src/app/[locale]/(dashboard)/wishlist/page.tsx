"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { PageShell } from "@/components/layout/page-shell";
import { FiltersBar } from "@/components/common/filters-bar";
import { LoadingState } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lightbulb, Plus, ThumbsUp, MessageSquare, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import * as api from "@/lib/mock/api";
import type { FeatureRequest } from "@/types/domain";

export default function WishlistPage() {
  const t = useTranslations("wishlist");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("votes");
  const [submitOpen, setSubmitOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    category: "Features",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getFeatureRequests();
        setRequests(res.data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getCategoryLabel = useCallback((category: string) => {
    const keyMap: Record<string, string> = {
      "Features": "features",
      "API": "api",
      "UI/UX": "uiux",
      "Integration": "integration",
      "Sicherheit": "security",
      "Security": "security",
    };
    const key = keyMap[category];
    if (key) {
      try {
        return t(`categories.${key}`);
      } catch {
        return category;
      }
    }
    return category;
  }, [t]);

  // Helper to get translated request title
  const getRequestTitle = useCallback((request: FeatureRequest) => {
    if (request.titleKey) {
      try {
        return t(`requests.${request.titleKey}.title`);
      } catch {
        return request.title;
      }
    }
    return request.title;
  }, [t]);

  // Helper to get translated request description
  const getRequestDescription = useCallback((request: FeatureRequest) => {
    if (request.descriptionKey) {
      try {
        return t(`requests.${request.descriptionKey}.description`);
      } catch {
        return request.description;
      }
    }
    return request.description;
  }, [t]);

  const categories = useMemo(() => {
    const cats = new Set(requests.map((r) => r.category));
    return Array.from(cats).map((c) => ({ 
      label: getCategoryLabel(c), 
      value: c 
    }));
  }, [requests, getCategoryLabel]);

  const filteredRequests = useMemo(() => {
    let result = requests.filter((r) => {
      const title = getRequestTitle(r);
      const description = getRequestDescription(r);
      const matchesSearch =
        title.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || categoryFilter === "all" || r.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case "votes":
        result = result.sort((a, b) => b.votes - a.votes);
        break;
      case "newest":
        result = result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "comments":
        result = result.sort((a, b) => b.comments - a.comments);
        break;
    }

    return result;
  }, [requests, search, categoryFilter, sortBy, getRequestTitle, getRequestDescription]);

  const myRequests = requests.filter((r) => r.authorId === "user_1");

  async function handleVote(id: string) {
    try {
      await api.voteFeatureRequest(id);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, voted: !r.voted, votes: r.voted ? r.votes - 1 : r.votes + 1 }
            : r
        )
      );
    } catch {
      toast.error(t("messages.voteError"));
    }
  }

  async function handleSubmit() {
    if (!newRequest.title || !newRequest.description) {
      toast.error(t("messages.fillAll"));
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.createFeatureRequest(newRequest);
      setRequests((prev) => [res.data, ...prev]);
      setSubmitOpen(false);
      setNewRequest({ title: "", description: "", category: "Features" });
      toast.success(t("messages.success"));
    } catch {
      toast.error(t("messages.error"));
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function getStatusVariant(status: FeatureRequest["status"]) {
    switch (status) {
      case "planned":
        return "default";
      case "in_progress":
        return "warning";
      case "completed":
        return "success";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  }

  function getStatusLabel(status: FeatureRequest["status"]) {
    switch (status) {
      case "pending":
        return t("status.pending");
      case "planned":
        return t("status.planned");
      case "in_progress":
        return t("status.inProgress");
      case "completed":
        return t("status.completed");
      case "rejected":
        return t("status.rejected");
      default:
        return status;
    }
  }

  function RequestCard({ request }: { request: FeatureRequest }) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1">
              <Button
                variant={request.voted ? "default" : "outline"}
                size="sm"
                className="h-12 w-12 flex-col p-0"
                onClick={() => handleVote(request.id)}
              >
                <ThumbsUp className={`h-4 w-4 ${request.voted ? "" : ""}`} />
                <span className="text-xs">{request.votes}</span>
              </Button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{getRequestTitle(request)}</h3>
                <Badge variant={getStatusVariant(request.status)}>
                  {getStatusLabel(request.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {getRequestDescription(request)}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <Badge variant="outline">{getCategoryLabel(request.category)}</Badge>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {request.comments}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(request.createdAt)}
                </span>
                <span>{t("by")} {request.authorName}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <PageShell title={t("title")} description={t("description")}>
        <LoadingState rows={4} />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={t("title")}
      description={t("description")}
      actions={
        <Button onClick={() => setSubmitOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addButton")}
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{requests.length}</div>
                <div className="text-sm text-muted-foreground">{t("stats.total")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-warning/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-accent-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {requests.filter((r) => r.status === "planned").length}
                </div>
                <div className="text-sm text-muted-foreground">{t("stats.planned")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-purple/10 rounded-lg">
                <Clock className="h-5 w-5 text-accent-purple" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {requests.filter((r) => r.status === "in_progress").length}
                </div>
                <div className="text-sm text-muted-foreground">{t("stats.inProgress")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-success/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-accent-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {requests.filter((r) => r.status === "completed").length}
                </div>
                <div className="text-sm text-muted-foreground">{t("stats.completed")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
          <TabsTrigger value="mine">{t("tabs.mine")} ({myRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-4">
          <FiltersBar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder={t("filters.searchPlaceholder")}
            filters={[
              {
                key: "category",
                label: t("filters.category"),
                options: categories,
                value: categoryFilter,
                onChange: setCategoryFilter,
              },
            ]}
            onReset={() => {
              setSearch("");
              setCategoryFilter("");
            }}
            actions={
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="votes">{t("sort.votes")}</SelectItem>
                  <SelectItem value="newest">{t("sort.newest")}</SelectItem>
                  <SelectItem value="comments">{t("sort.comments")}</SelectItem>
                </SelectContent>
              </Select>
            }
          />

          {filteredRequests.length === 0 ? (
            <EmptyState
              icon={Lightbulb}
              title={t("empty.title")}
              description={t("empty.description")}
            />
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mine" className="mt-6">
          {myRequests.length === 0 ? (
            <EmptyState
              icon={Lightbulb}
              title={t("empty.noMine")}
              description={t("empty.noMineDesc")}
              action={{ label: t("addButton"), onClick: () => setSubmitOpen(true) }}
            />
          ) : (
            <div className="space-y-4">
              {myRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Submit Dialog */}
      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dialog.title")}</DialogTitle>
            <DialogDescription>
              {t("dialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("dialog.titleLabel")}</Label>
              <Input
                id="title"
                placeholder={t("dialog.titlePlaceholder")}
                value={newRequest.title}
                onChange={(e) =>
                  setNewRequest((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t("dialog.category")}</Label>
              <Select
                value={newRequest.category}
                onValueChange={(v) =>
                  setNewRequest((prev) => ({ ...prev, category: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Features">{t("categories.features")}</SelectItem>
                  <SelectItem value="API">{t("categories.api")}</SelectItem>
                  <SelectItem value="UI/UX">{t("categories.uiux")}</SelectItem>
                  <SelectItem value="Integration">{t("categories.integration")}</SelectItem>
                  <SelectItem value="Sicherheit">{t("categories.security")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("dialog.descriptionLabel")}</Label>
              <Textarea
                id="description"
                placeholder={t("dialog.descriptionPlaceholder")}
                value={newRequest.description}
                onChange={(e) =>
                  setNewRequest((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitOpen(false)}>
              {tCommon("actions.cancel")}
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? t("dialog.submitting") : t("dialog.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
