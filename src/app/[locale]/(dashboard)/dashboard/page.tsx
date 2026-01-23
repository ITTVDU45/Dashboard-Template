"use client";

import { useTranslations } from "next-intl";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, Settings, FileText, HeadphonesIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  return (
    <PageShell
      title={t("title")}
      description={t("description")}
    >
      {/* Coming Soon Notice */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <CardContent className="py-16">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="p-4 bg-primary/10 rounded-2xl mb-6">
              <Construction className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Dashboard wird erstellt
            </h2>
            <p className="text-muted-foreground mb-8">
              Das Dashboard befindet sich noch in der Entwicklung. 
              Hier werden bald Ihre wichtigsten Kennzahlen und Statistiken angezeigt.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Einstellungen
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs">
                  <FileText className="h-4 w-4 mr-2" />
                  Dokumentation
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/support">
                  <HeadphonesIcon className="h-4 w-4 mr-2" />
                  Support
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
