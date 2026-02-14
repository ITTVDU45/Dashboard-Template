"use client"

import { cn } from "@/lib/utils"
import { SYNC_STATUS_CONFIG } from "../_lib/constants"

interface TemplateSyncBadgeProps {
  status: string
  className?: string
}

export function TemplateSyncBadge({ status, className }: TemplateSyncBadgeProps) {
  const config = SYNC_STATUS_CONFIG[status] || SYNC_STATUS_CONFIG.none
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-medium",
        config.color,
        status === "syncing" && "animate-pulse",
        className
      )}
    >
      <Icon className={cn("h-3 w-3", status === "syncing" && "animate-spin")} />
      {config.label}
    </span>
  )
}
