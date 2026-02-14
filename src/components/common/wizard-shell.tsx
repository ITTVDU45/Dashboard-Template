"use client"

import { cn } from "@/lib/utils"

interface WizardShellProps {
  step: number
  steps: string[]
  children: React.ReactNode
}

export function WizardShell({ step, steps, children }: WizardShellProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-2 md:grid-cols-6">
        {steps.map((label, index) => {
          const itemStep = index + 1
          return (
            <div
              key={label}
              className={cn(
                "rounded-lg border p-3 text-xs",
                itemStep === step && "border-primary bg-primary/10 text-primary",
                itemStep < step && "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
              )}
            >
              <p className="font-medium">Schritt {itemStep}</p>
              <p className="mt-1 text-muted-foreground">{label}</p>
            </div>
          )
        })}
      </div>
      {children}
    </div>
  )
}
