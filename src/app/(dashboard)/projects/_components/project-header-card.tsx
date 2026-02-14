"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Play, Link2, Plus, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

export type AddDrawerType = "todo" | "note" | "milestone" | "offer" | "invoice"

interface ProjectHeaderCardProps {
  project: { id: string; name: string; slug: string; previewUrl: string | null }
  companyName: string
  subline?: string
  onStartWorkflow?: () => void
  onAdd?: (type: AddDrawerType) => void
  className?: string
}

export function ProjectHeaderCard({
  project,
  companyName,
  subline = "Projektansicht mit Übersicht, Aktivitäten, To-dos, Finanzen, Jobs und Assets",
  onStartWorkflow,
  onAdd,
  className,
}: ProjectHeaderCardProps) {
  const handleCopyPreview = () => {
    if (project.previewUrl) {
      void navigator.clipboard.writeText(project.previewUrl)
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card/40 p-4 shadow-sm backdrop-blur-sm md:p-5",
        className
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{project.name}</h1>
          <p className="mt-1.5 max-w-3xl text-sm text-muted-foreground md:text-base">
            {subline}
          </p>
          {companyName ? (
            <p className="mt-1 text-xs text-muted-foreground">Unternehmen: {companyName}</p>
          ) : null}
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <Button asChild variant="default" size="sm" className="md:mt-0">
            <Link href={`/projects/${project.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Projekt bearbeiten
            </Link>
          </Button>
          {onStartWorkflow ? (
            <Button variant="outline" size="icon" onClick={onStartWorkflow} title="Workflow starten">
              <Play className="h-4 w-4" />
              <span className="sr-only">Workflow starten</span>
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="icon"
            title={project.previewUrl ? "Preview-Link kopieren" : "Noch keine Preview"}
            onClick={handleCopyPreview}
            disabled={!project.previewUrl}
          >
            <Link2 className="h-4 w-4" />
            <span className="sr-only">Preview</span>
          </Button>
          {onAdd ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" title="Hinzufügen">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Hinzufügen</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onAdd("todo")}>To-do</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAdd("note")}>Aktivität (Notiz)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAdd("milestone")}>Meilenstein</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAdd("offer")}>Angebot</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAdd("invoice")}>Rechnung</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </div>
  )
}
