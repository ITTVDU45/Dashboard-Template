"use client"

import { useParams } from "next/navigation"
import { useDesignDetail } from "../_hooks/use-design-detail"
import { DesignDetailHeader } from "../_components/design-detail-header"
import { DesignGallery } from "../_components/design-gallery"
import { DesignMetaPanel } from "../_components/design-meta-panel"
import { DesignRelated } from "../_components/design-related"

export default function DesignDetailPage() {
  const params = useParams<{ id: string }>()
  const {
    design,
    related,
    isLoading,
    lightboxIndex,
    setLightboxIndex,
    updateStatus,
  } = useDesignDetail(params.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!design) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Design nicht gefunden.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <DesignDetailHeader
        design={design}
        onStatusChange={updateStatus}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Left: Gallery */}
        <div className="space-y-6">
          <DesignGallery
            design={design}
            lightboxIndex={lightboxIndex}
            onLightboxChange={setLightboxIndex}
          />
        </div>

        {/* Right: Meta Panel */}
        <div className="space-y-6">
          <DesignMetaPanel design={design} />
        </div>
      </div>

      {/* Related Designs */}
      <DesignRelated designs={related} />
    </div>
  )
}
