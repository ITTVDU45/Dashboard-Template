"use client"

import Link from "next/link"
import { Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DesignData } from "../_lib/types"
import { getCoverImage, parseTags } from "../_lib/helpers"
import { CATEGORY_LABELS } from "../_lib/constants"

interface DesignRelatedProps {
  designs: DesignData[]
}

export function DesignRelated({ designs }: DesignRelatedProps) {
  if (designs.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Ähnliche Designs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {designs.map((design) => {
            const cover = getCoverImage(design)
            const tags = parseTags(design.tags)

            return (
              <Link
                key={design.id}
                href={`/designs/${design.id}`}
                className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                {cover ? (
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt={design.name}
                      className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-muted/30">
                    <Eye className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                )}
                <div className="p-2">
                  <p className="truncate text-xs font-medium">{design.name}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {design.category && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0">
                        {CATEGORY_LABELS[design.category] || design.category}
                      </Badge>
                    )}
                    {tags.slice(0, 1).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
