"use client"

import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DesignData, ImageData } from "../_lib/types"
import { parseImages, getCoverImage } from "../_lib/helpers"

interface DesignGalleryProps {
  design: DesignData
  lightboxIndex: number | null
  onLightboxChange: (index: number | null) => void
}

export function DesignGallery({ design, lightboxIndex, onLightboxChange }: DesignGalleryProps) {
  const images = parseImages(design.images)
  const coverImage = getCoverImage(design)

  // Build gallery items: cover first, then additional images
  const galleryItems: { url: string; label: string }[] = []
  if (coverImage) galleryItems.push({ url: coverImage, label: "Cover" })
  images.forEach((img: ImageData) => {
    if (img.url !== coverImage) {
      const kindLabel = img.kind === "full" ? "Vollbild" : img.kind === "hero_crop" ? "Hero" : img.kind === "navbar_crop" ? "Navbar" : "Bild"
      galleryItems.push({ url: img.url, label: kindLabel })
    }
  })

  // Fallback: screenshotUrl if no gallery items yet
  if (galleryItems.length === 0 && design.screenshotUrl) {
    galleryItems.push({ url: design.screenshotUrl, label: "Screenshot" })
  }

  if (galleryItems.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border bg-muted/30">
        <p className="text-sm text-muted-foreground">Kein Vorschaubild vorhanden</p>
      </div>
    )
  }

  return (
    <>
      {/* Main Preview */}
      <div
        className="group relative cursor-pointer overflow-hidden rounded-xl border"
        onClick={() => onLightboxChange(0)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={galleryItems[0].url}
          alt={design.name}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
          <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      {/* Thumbnail Strip */}
      {galleryItems.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {galleryItems.map((item, index) => (
            <button
              key={index}
              onClick={() => onLightboxChange(index)}
              className="relative flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors hover:border-primary data-[active=true]:border-primary"
              data-active={lightboxIndex === index}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.label}
                className="h-16 w-24 object-cover"
              />
              <span className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-[10px] text-white text-center">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <button
            onClick={() => onLightboxChange(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev */}
          {lightboxIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white hover:bg-white/10"
              onClick={() => onLightboxChange(lightboxIndex - 1)}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={galleryItems[lightboxIndex].url}
            alt={galleryItems[lightboxIndex].label}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
          />

          {/* Next */}
          {lightboxIndex < galleryItems.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white hover:bg-white/10"
              onClick={() => onLightboxChange(lightboxIndex + 1)}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
            {lightboxIndex + 1} / {galleryItems.length}
          </div>
        </div>
      )}
    </>
  )
}
