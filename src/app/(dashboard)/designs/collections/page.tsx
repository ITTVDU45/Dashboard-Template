"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Trash2, FolderOpen, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/common/page-header"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CollectionData, DesignData } from "../_lib/types"
import { parseStringArray, getCoverImage } from "../_lib/helpers"

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionData[]>([])
  const [designs, setDesigns] = useState<DesignData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [colRes, desRes] = await Promise.all([
        fetch("/api/collections"),
        fetch("/api/designs"),
      ])
      const colPayload = await colRes.json()
      const desPayload = await desRes.json()
      setCollections(colPayload.data ?? [])
      setDesigns(desPayload.data ?? [])
    } catch (err) {
      console.error("Fehler beim Laden:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleCreate() {
    if (!newName.trim()) return
    await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDescription || undefined }),
    })
    setNewName("")
    setNewDescription("")
    setCreateOpen(false)
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm("Collection wirklich löschen?")) return
    await fetch(`/api/collections/${id}`, { method: "DELETE" })
    fetchData()
  }

  function getCollectionDesigns(collection: CollectionData): DesignData[] {
    const ids = parseStringArray(collection.designIds)
    return designs.filter((d) => ids.includes(d.id))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Collections"
        description="Designs in Sammlungen organisieren und verwalten"
      >
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-1.5 h-4 w-4" />
              Neue Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neue Collection erstellen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="z.B. Hero Inspirationen"
                />
              </div>
              <div className="space-y-2">
                <Label>Beschreibung</Label>
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Optionale Beschreibung..."
                  rows={2}
                />
              </div>
              <Button onClick={handleCreate} disabled={!newName.trim()} className="w-full">
                Collection erstellen
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-sm font-medium text-muted-foreground">Noch keine Collections vorhanden</p>
          <p className="mt-1 text-xs text-muted-foreground">Erstelle deine erste Collection, um Designs zu organisieren.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => {
            const colDesigns = getCollectionDesigns(collection)
            const previewImages = colDesigns
              .map((d) => getCoverImage(d))
              .filter(Boolean)
              .slice(0, 4)

            return (
              <Card key={collection.id} className="group overflow-hidden transition-all hover:shadow-md">
                {/* Preview Thumbnails Grid */}
                <div className="grid grid-cols-2 gap-0.5 bg-muted/30">
                  {previewImages.length > 0 ? (
                    previewImages.map((img, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={img!}
                        alt=""
                        className="aspect-video w-full object-cover"
                      />
                    ))
                  ) : (
                    <div className="col-span-2 flex aspect-video items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Fill remaining slots */}
                  {previewImages.length > 0 && previewImages.length < 4 &&
                    Array.from({ length: 4 - previewImages.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-video bg-muted/20" />
                    ))
                  }
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/designs?collection=${collection.id}`}
                        className="text-sm font-semibold hover:text-primary transition-colors"
                      >
                        {collection.name}
                      </Link>
                      {collection.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{collection.description}</p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {colDesigns.length} Design{colDesigns.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                      onClick={() => handleDelete(collection.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
