"use client"

import { useCallback, useEffect, useState } from "react"
import type { DesignData, CollectionData } from "../_lib/types"
import { parseTags, getCoverImage } from "../_lib/helpers"

export function useDesignDetail(id: string) {
  const [design, setDesign] = useState<DesignData | null>(null)
  const [related, setRelated] = useState<DesignData[]>([])
  const [collections, setCollections] = useState<CollectionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const fetchDesign = useCallback(async () => {
    setIsLoading(true)
    try {
      const [designRes, allDesignsRes, collectionsRes] = await Promise.all([
        fetch(`/api/designs/${id}`),
        fetch("/api/designs"),
        fetch("/api/collections"),
      ])
      const designPayload = await designRes.json()
      const allDesignsPayload = await allDesignsRes.json()
      const collectionsPayload = await collectionsRes.json()

      const d: DesignData = designPayload.data
      setDesign(d)
      setCollections(collectionsPayload.data ?? [])

      // Related designs: same category or overlapping tags
      if (d) {
        const allDesigns: DesignData[] = allDesignsPayload.data ?? []
        const myTags = new Set(parseTags(d.tags))
        const relatedList = allDesigns
          .filter((other) => other.id !== d.id)
          .map((other) => {
            let score = 0
            if (d.category && other.category === d.category) score += 2
            if (d.industry && other.industry === d.industry) score += 1
            const otherTags = parseTags(other.tags)
            otherTags.forEach((t) => { if (myTags.has(t)) score += 1 })
            return { design: other, score }
          })
          .filter((r) => r.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 4)
          .map((r) => r.design)
        setRelated(relatedList)
      }
    } catch (err) {
      console.error("Fehler beim Laden des Designs:", err)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => { fetchDesign() }, [fetchDesign])

  async function updateDesignField(field: string, value: unknown) {
    if (!design) return
    await fetch(`/api/designs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    })
    fetchDesign()
  }

  async function updateTags(tags: string[]) {
    return updateDesignField("tags", tags)
  }

  async function updateStatus(status: string) {
    return updateDesignField("status", status)
  }

  async function updateCollections(collectionIds: string[]) {
    return updateDesignField("collectionIds", collectionIds)
  }

  const coverImage = design ? getCoverImage(design) : null

  return {
    design,
    related,
    collections,
    isLoading,
    coverImage,
    lightboxIndex,
    setLightboxIndex,
    updateTags,
    updateStatus,
    updateCollections,
    refetch: fetchDesign,
  }
}
