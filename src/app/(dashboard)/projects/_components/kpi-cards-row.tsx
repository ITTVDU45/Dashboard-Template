"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface KpiCardItem {
  title: string
  subtitle?: string
  value: React.ReactNode
  actionLabel: string
  onAction: () => void
}

interface KpiCardsRowProps {
  items: KpiCardItem[]
  className?: string
}

export function KpiCardsRow({ items, className }: KpiCardsRowProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-3", className)}>
      {items.map((item) => (
        <Card key={item.title} className="rounded-2xl border-border/70 bg-card/40 shadow-sm">
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
            {item.subtitle ? <p className="text-xs text-muted-foreground">{item.subtitle}</p> : null}
            <p className="mt-1 text-2xl font-semibold text-foreground">{item.value}</p>
            <Button variant="ghost" size="sm" className="mt-2 -ml-2" onClick={item.onAction}>
              {item.actionLabel}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
