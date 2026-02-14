"use client"

import { File, ExternalLink, Calendar, HardDrive, Tag, Link2, Copy, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { FilePreviewProps } from "../_lib/types"
import {
  FILE_TYPE_ICONS,
  FILE_TYPE_COLORS,
  FILE_TYPE_LABELS,
} from "../_lib/constants"

// ─── JSON Pretty Viewer ──────────────────────────────────────────────────────

function JsonPreview({ raw }: { raw: string }) {
  try {
    const parsed = JSON.parse(raw)
    return (
      <pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 text-xs leading-relaxed text-foreground/80">
        {JSON.stringify(parsed, null, 2)}
      </pre>
    )
  } catch {
    return (
      <pre className="overflow-x-auto rounded-lg border bg-muted/30 p-4 text-xs leading-relaxed text-foreground/80">
        {raw}
      </pre>
    )
  }
}

// ─── Copy Button ─────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="In Zwischenablage kopieren"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-accent-success" />
          <span>Kopiert</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          <span>Kopieren</span>
        </>
      )}
    </button>
  )
}

// ─── Main Preview Component ──────────────────────────────────────────────────

export function FilePreview({ asset }: FilePreviewProps) {
  // ── Empty state ──
  if (!asset) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="rounded-2xl bg-muted/30 p-6">
          <File className="mx-auto h-12 w-12 text-muted-foreground/25" />
        </div>
        <p className="mt-5 text-sm font-medium text-muted-foreground">
          Datei auswählen
        </p>
        <p className="mt-1.5 max-w-[200px] text-xs text-muted-foreground/60">
          Klicke auf eine Datei im Baum links, um eine Vorschau zu sehen
        </p>
      </div>
    )
  }

  // ── Derive info ──
  const fileName = asset.storageKey.split("/").pop() ?? asset.storageKey
  const fileExt = fileName.includes(".") ? fileName.split(".").pop()?.toUpperCase() : null
  const TypeIcon =
    FILE_TYPE_ICONS[asset.type] ?? FILE_TYPE_ICONS.default
  const typeColor =
    FILE_TYPE_COLORS[asset.type] ?? FILE_TYPE_COLORS.default
  const typeLabel = FILE_TYPE_LABELS[asset.type] ?? asset.type

  const createdDate = new Date(asset.createdAt).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* ── Header ── */}
      <div className="shrink-0 border-b bg-surface/50 px-6 py-4">
        <div className="flex items-start gap-3">
          <div className={cn("rounded-lg p-2", typeColor)}>
            <TypeIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-foreground">
              {fileName}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                  typeColor
                )}
              >
                {typeLabel}
              </span>
              {fileExt && (
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  .{fileExt.toLowerCase()}
                </span>
              )}
            </div>
          </div>

          {/* Open external link */}
          {asset.publicUrl && (
            <a
              href={asset.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Öffnen
            </a>
          )}
        </div>
      </div>

      {/* ── Preview Area ── */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Image preview */}
        {asset.type === "image" && asset.publicUrl && (
          <div className="mb-6 overflow-hidden rounded-xl border bg-muted/20 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.publicUrl}
              alt={fileName}
              className="mx-auto max-h-[400px] rounded-lg object-contain"
              loading="lazy"
            />
          </div>
        )}

        {/* Video preview */}
        {asset.type === "video" && asset.publicUrl && (
          <div className="mb-6 overflow-hidden rounded-xl border bg-black">
            <video
              controls
              className="mx-auto max-h-[400px] w-full"
              preload="metadata"
            >
              <source src={asset.publicUrl} />
              Dein Browser unterstützt kein Video-Playback.
            </video>
          </div>
        )}

        {/* HTML/Code preview */}
        {(asset.type === "html" || asset.type === "bundle") && asset.publicUrl && (
          <div className="mb-6">
            <div className="flex items-center justify-between rounded-t-xl border border-b-0 bg-muted/30 px-4 py-2">
              <span className="text-xs font-medium text-muted-foreground">HTML-Vorschau</span>
              <a
                href={asset.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                In neuem Tab öffnen
              </a>
            </div>
            <div className="overflow-hidden rounded-b-xl border">
              <iframe
                src={asset.publicUrl}
                className="h-[300px] w-full bg-white"
                title={`Vorschau: ${fileName}`}
                sandbox="allow-scripts"
              />
            </div>
          </div>
        )}

        {/* JSON/Report preview */}
        {asset.type === "report" && asset.meta && (
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Metadaten (JSON)
              </span>
              <CopyButton text={asset.meta} />
            </div>
            <JsonPreview raw={asset.meta} />
          </div>
        )}

        {/* Generic meta preview for other types */}
        {asset.type !== "report" && asset.meta && (
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Metadaten
              </span>
              <CopyButton text={asset.meta} />
            </div>
            <JsonPreview raw={asset.meta} />
          </div>
        )}

        {/* ── Details Grid ── */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Details
          </h3>

          <div className="grid gap-2">
            <DetailRow
              icon={HardDrive}
              label="Storage Key"
              value={asset.storageKey}
              copyable
            />
            <DetailRow
              icon={Tag}
              label="Typ"
              value={typeLabel}
            />
            <DetailRow
              icon={Calendar}
              label="Erstellt"
              value={createdDate}
            />
            {asset.publicUrl && (
              <DetailRow
                icon={Link2}
                label="Öffentliche URL"
                value={asset.publicUrl}
                copyable
                isLink
              />
            )}
            {asset.projectId && (
              <DetailRow
                icon={Tag}
                label="Projekt-ID"
                value={asset.projectId}
              />
            )}
            {asset.jobId && (
              <DetailRow
                icon={Tag}
                label="Job-ID"
                value={asset.jobId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Detail Row Sub-Component ────────────────────────────────────────────────

interface DetailRowProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  copyable?: boolean
  isLink?: boolean
}

function DetailRow({ icon: Icon, label, value, copyable, isLink }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-muted/20 px-3 py-2.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
          {label}
        </p>
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-xs text-primary hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="truncate text-xs text-foreground/80">{value}</p>
        )}
      </div>
      {copyable && <CopyButton text={value} />}
    </div>
  )
}
