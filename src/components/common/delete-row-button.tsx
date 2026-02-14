"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/common/confirm-dialog"

interface DeleteRowButtonProps {
  endpoint: string
  label?: string
}

export function DeleteRowButton({ endpoint, label = "Löschen" }: DeleteRowButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleDelete() {
    setIsLoading(true)
    await fetch(endpoint, { method: "DELETE" })
    setIsLoading(false)
    setIsOpen(false)
    router.refresh()
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setIsOpen(true)}>
        {label}
      </Button>
      <ConfirmDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Wirklich loeschen?"
        description="Diese Aktion kann nicht rueckgaengig gemacht werden."
        onConfirm={handleDelete}
        variant="destructive"
        loading={isLoading}
      />
    </>
  )
}
