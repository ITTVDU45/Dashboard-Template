"use client"

import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AgentRunButtonProps {
  isRunning: boolean
  isDisabled: boolean
  onClick: () => void
}

export function AgentRunButton({ isRunning, isDisabled, onClick }: AgentRunButtonProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      className="h-8 flex-1 gap-1.5 text-xs"
      onClick={onClick}
      disabled={isDisabled || isRunning}
    >
      {isRunning ? (
        <>
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Läuft...
        </>
      ) : (
        <>
          <Play className="h-3 w-3" />
          Ausführen
        </>
      )}
    </Button>
  )
}
