import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
  className?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, ctaLabel, ctaHref, className, children }: PageHeaderProps) {
  return (
    <div className={cn("rounded-2xl border border-border/70 bg-card/40 p-4 backdrop-blur-sm md:p-5", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          <p className="mt-1.5 max-w-3xl text-sm text-muted-foreground md:text-base">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {ctaLabel && ctaHref ? (
          <Button asChild className="md:mt-0">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        ) : null}
        {children}
      </div>
      </div>
    </div>
  )
}
