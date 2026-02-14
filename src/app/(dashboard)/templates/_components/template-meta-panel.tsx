"use client"

import {
  Tag,
  Calendar,
  BarChart3,
  FileCode2,
  Folder,
  GitBranch,
  Hash,
} from "lucide-react"
import {
  TYPE_LABELS,
  FRAMEWORK_LABELS,
  CATEGORY_LABELS,
  SOURCE_LABELS,
  UI_STACK_LABELS,
} from "../_lib/constants"
import { parseTags, relativeTime } from "../_lib/helpers"
import type { TemplateData } from "../_lib/types"

interface TemplateMetaPanelProps {
  template: TemplateData
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-muted/20 px-3 py-2.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
          {label}
        </p>
        <div className="text-xs text-foreground/80">{value}</div>
      </div>
    </div>
  )
}

export function TemplateMetaPanel({ template }: TemplateMetaPanelProps) {
  const tags = parseTags(template.tags)

  return (
    <div className="space-y-6 p-6">
      <h3 className="text-sm font-semibold text-foreground">Template-Metadaten</h3>

      <div className="grid gap-2">
        <MetaRow icon={Tag} label="Typ" value={TYPE_LABELS[template.type] || template.type} />
        {template.category && (
          <MetaRow icon={Tag} label="Kategorie" value={CATEGORY_LABELS[template.category] || template.category} />
        )}
        <MetaRow icon={FileCode2} label="Framework" value={FRAMEWORK_LABELS[template.framework] || template.framework} />
        {template.uiStack && (
          <MetaRow icon={FileCode2} label="UI-Stack" value={UI_STACK_LABELS[template.uiStack] || template.uiStack} />
        )}
        <MetaRow icon={Folder} label="Quelle" value={SOURCE_LABELS[template.sourceMode] || template.sourceMode} />
        {template.repoFullName && (
          <MetaRow icon={GitBranch} label="Repository" value={template.repoFullName} />
        )}
        {template.defaultBranch && (
          <MetaRow icon={GitBranch} label="Branch" value={template.defaultBranch} />
        )}
        {template.templateRootPath && (
          <MetaRow icon={Folder} label="Root-Pfad" value={template.templateRootPath} />
        )}
        {template.entryFile && (
          <MetaRow icon={FileCode2} label="Entry-Datei" value={template.entryFile} />
        )}
        <MetaRow icon={Hash} label="Slug" value={template.slug} />
        <MetaRow icon={BarChart3} label="Verwendet" value={`${template.usesCount}x`} />
        <MetaRow icon={Calendar} label="Erstellt" value={relativeTime(template.createdAt)} />
        <MetaRow icon={Calendar} label="Aktualisiert" value={relativeTime(template.updatedAt)} />
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tags
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
