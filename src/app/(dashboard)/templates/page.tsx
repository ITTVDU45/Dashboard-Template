"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/components/common/page-header"
import { useTemplates } from "./_hooks/use-templates"
import { TemplateCategorySidebar } from "./_components/template-category-sidebar"
import { TemplateThumbnailList } from "./_components/template-thumbnail-list"
import { TemplatePreviewPanel } from "./_components/template-preview-panel"

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

  const {
    templates,
    isLoading,
    search,
    setSearch,
    setFilterType,
    setFilterCategory,
    handleSync,
    syncingId,
  } = useTemplates()

  // Filter Templates basierend auf activeCategory
  const filteredTemplates = useMemo(() => {
    if (!activeCategory) {
      // "Alle" - keine Filter
      setFilterType(null)
      setFilterCategory(null)
      return templates
    }

    if (activeCategory === "_project") {
      setFilterType("project")
      setFilterCategory(null)
      return templates.filter((t) => t.type === "project")
    }

    if (activeCategory === "_component") {
      setFilterType("component")
      setFilterCategory(null)
      return templates.filter((t) => t.type === "component")
    }

    if (activeCategory === "_section") {
      setFilterType("section")
      setFilterCategory(null)
      return templates.filter((t) => t.type === "section")
    }

    // Section Category (hero, pricing, etc.)
    setFilterType(null)
    setFilterCategory(activeCategory)
    return templates.filter((t) => t.category === activeCategory)
  }, [activeCategory, templates, setFilterType, setFilterCategory])

  // Auto-select first template wenn Liste sich ändert
  useMemo(() => {
    if (filteredTemplates.length > 0 && !selectedTemplateId) {
      setSelectedTemplateId(filteredTemplates[0].id)
    } else if (
      filteredTemplates.length > 0 &&
      !filteredTemplates.find((t) => t.id === selectedTemplateId)
    ) {
      setSelectedTemplateId(filteredTemplates[0].id)
    }
  }, [filteredTemplates, selectedTemplateId])

  const selectedTemplate =
    filteredTemplates.find((t) => t.id === selectedTemplateId) || null

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="shrink-0">
        <PageHeader
          title="Templates"
          description="Wiederverwendbare Projekte, Komponenten und Sections."
          ctaLabel="Template hinzufügen"
          ctaHref="/templates/new"
        />
      </div>

      {/* 3-Spalten-Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Links: Kategorie-Sidebar */}
        <TemplateCategorySidebar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          search={search}
          onSearchChange={setSearch}
        />

        {/* Mitte: Thumbnail-Liste */}
        <TemplateThumbnailList
          templates={filteredTemplates}
          selectedId={selectedTemplateId}
          onSelect={setSelectedTemplateId}
          isLoading={isLoading}
        />

        {/* Rechts: Preview-Panel */}
        <TemplatePreviewPanel
          template={selectedTemplate}
          isSyncing={syncingId === selectedTemplateId}
          onSync={handleSync}
        />
      </div>
    </div>
  )
}
