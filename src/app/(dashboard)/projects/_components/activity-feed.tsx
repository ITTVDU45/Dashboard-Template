"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

function formatRelative(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffM = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)
  if (diffM < 1) return "gerade eben"
  if (diffM < 60) return `vor ${diffM} Min.`
  if (diffH < 24) return `vor ${diffH} Std.`
  if (diffD < 7) return `vor ${diffD} Tagen`
  return date.toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" })
}

export interface ActivityItem {
  id: string
  summary: string | null
  entityType: string
  entityId: string
  createdAt: string
  action: string
}

interface ActivityFeedProps {
  items: ActivityItem[]
  projectId: string
  getHref?: (item: ActivityItem) => string | null
  className?: string
  maxItems?: number
}

export function ActivityFeed({
  items,
  projectId,
  getHref,
  className,
  maxItems = 5,
}: ActivityFeedProps) {
  const list = items.slice(0, maxItems)
  return (
    <div className={cn("space-y-1", className)}>
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">Keine Aktivitäten.</p>
      ) : (
        list.map((item) => {
          const href = getHref?.(item) ?? null
          const content = (
            <span className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
              <span className="text-sm text-foreground">{item.summary || `${item.entityType} ${item.action}`}</span>
              <span className="text-xs text-muted-foreground">
                {formatRelative(new Date(item.createdAt))}
              </span>
            </span>
          )
          if (href) {
            return (
              <Link
                key={item.id}
                href={href}
                className="block rounded-lg border border-transparent p-2 text-left transition-colors hover:bg-muted/50 hover:border-border"
              >
                {content}
              </Link>
            )
          }
          return (
            <div
              key={item.id}
              className="rounded-lg border border-transparent p-2 text-left"
            >
              {content}
            </div>
          )
        })
      )}
    </div>
  )
}
