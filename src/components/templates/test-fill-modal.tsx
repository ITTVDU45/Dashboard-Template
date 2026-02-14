"use client"

import { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TestFillModalProps {
  layoutCode: string | null
  placeholdersSchema: string | null
}

export function TestFillModal({ layoutCode, placeholdersSchema }: TestFillModalProps) {
  const fields = useMemo(() => {
    if (!placeholdersSchema) return ["title", "subtitle", "cta"]
    try {
      return Object.keys(JSON.parse(placeholdersSchema))
    } catch {
      return ["title", "subtitle", "cta"]
    }
  }, [placeholdersSchema])

  const [values, setValues] = useState<Record<string, string>>({})

  const rendered = useMemo(() => {
    let template = layoutCode || "<section><h1>{{title}}</h1><p>{{subtitle}}</p><a>{{cta}}</a></section>"
    Object.entries(values).forEach(([key, value]) => {
      template = template.replaceAll(`{{${key}}}`, value)
    })
    return template
  }, [layoutCode, values])

  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">Testbefüllung</Button></DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Template-Testbefüllung</DialogTitle>
          <DialogDescription>Platzhalter ausfüllen und Live-Vorschau prüfen.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field} className="space-y-1">
                <Label>{field}</Label>
                <Input
                  value={values[field] || ""}
                  onChange={(event) =>
                    setValues((prev) => ({ ...prev, [field]: event.target.value }))
                  }
                />
              </div>
            ))}
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="mb-2 text-xs text-muted-foreground">Client-seitige Vorschau</p>
            <div className="rounded border bg-background p-3">
              <div dangerouslySetInnerHTML={{ __html: rendered }} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
