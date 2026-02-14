"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface InfoRow {
  label: string
  value: React.ReactNode
}

interface InfoCardProps {
  rows: InfoRow[]
  className?: string
  columns?: 1 | 2
}

export function InfoCard({ rows, className, columns = 2 }: InfoCardProps) {
  return (
    <Card className={cn("rounded-2xl border-border/70 bg-card/40 shadow-sm", className)}>
      <CardContent className={cn("grid gap-x-6 gap-y-3 pt-6", columns === 2 && "md:grid-cols-2")}>
        {rows.map(({ label, value }) => (
          <div key={label} className="space-y-0.5">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-sm text-foreground">{value ?? "–"}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
