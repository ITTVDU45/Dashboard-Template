"use client"

import { createContext, useContext, useState } from "react"

interface UiStateContextValue {
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
}

const UiStateContext = createContext<UiStateContextValue | null>(null)

export function UiStateProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  function toggleSidebar() {
    setIsSidebarCollapsed((value) => !value)
  }

  return (
    <UiStateContext.Provider value={{ isSidebarCollapsed, toggleSidebar }}>
      {children}
    </UiStateContext.Provider>
  )
}

export function useUiState() {
  const context = useContext(UiStateContext)
  if (!context) throw new Error("useUiState must be used inside UiStateProvider")
  return context
}
