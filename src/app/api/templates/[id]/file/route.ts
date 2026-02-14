import { prisma } from "@/lib/prisma"
import { fail, ok } from "@/lib/api-helpers"
import { NextRequest } from "next/server"

/**
 * GET /api/templates/:id/file?path=src/components/Hero.tsx
 *
 * MVP: Returns demo file content based on file extension.
 * In the future, this will fetch actual file content from GitHub or MinIO.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const filePath = request.nextUrl.searchParams.get("path")

  if (!filePath) return fail("Query parameter 'path' is required", 400)

  const template = await prisma.template.findUnique({
    where: { id },
    select: { name: true, slug: true, layoutCode: true, sourceMode: true },
  })
  if (!template) return fail("Template not found", 404)

  // For local templates, return the layoutCode as the content
  if (template.sourceMode === "local" && template.layoutCode) {
    return ok({ content: template.layoutCode, path: filePath })
  }

  // MVP: Generate demo content based on file extension
  const content = generateDemoContent(filePath, template.name)
  return ok({ content, path: filePath })
}

// ── Demo Content Generator ───────────────────────────────────────────────────

function generateDemoContent(filePath: string, templateName: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase() || ""
  const fileName = filePath.split("/").pop() || filePath

  switch (ext) {
    case "tsx":
      return `// ${fileName} - ${templateName}
import React from "react"

interface ${fileName.replace(/\.\w+$/, "")}Props {
  title?: string
  subtitle?: string
}

export function ${fileName.replace(/\.\w+$/, "")}({ title, subtitle }: ${fileName.replace(/\.\w+$/, "")}Props) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold tracking-tight">
          {title || "${templateName}"}
        </h2>
        {subtitle && (
          <p className="mt-4 text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
`

    case "ts":
      return `// ${fileName} - ${templateName}

export const siteConfig = {
  name: "${templateName}",
  description: "Generated from template",
  url: "https://example.com",
}

export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
`

    case "css":
      return `/* ${fileName} - ${templateName} */

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: 217 91% 60%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}

.dark {
  --primary: 217 91% 60%;
  --background: 220 20% 6%;
  --foreground: 220 10% 90%;
}
`

    case "json":
      if (fileName === "package.json") {
        return JSON.stringify({
          name: templateName.toLowerCase().replace(/\s+/g, "-"),
          version: "1.0.0",
          private: true,
          scripts: { dev: "next dev", build: "next build", start: "next start" },
          dependencies: { next: "^15.0.0", react: "^19.0.0", "react-dom": "^19.0.0" },
          devDependencies: { typescript: "^5.0.0", tailwindcss: "^3.4.0" },
        }, null, 2)
      }
      if (fileName === "tsconfig.json") {
        return JSON.stringify({
          compilerOptions: {
            target: "ES2017",
            lib: ["dom", "dom.iterable", "esnext"],
            strict: true,
            jsx: "preserve",
            paths: { "@/*": ["./src/*"] },
          },
          include: ["**/*.ts", "**/*.tsx"],
        }, null, 2)
      }
      return JSON.stringify({ name: templateName, version: "1.0.0" }, null, 2)

    case "md":
      return `# ${templateName}

> Automatisch generierte README für dieses Template.

## Installation

\`\`\`bash
npx create-next-app --example ${templateName.toLowerCase().replace(/\s+/g, "-")}
\`\`\`

## Verwendung

Dieses Template enthält vorkonfigurierte Komponenten und Layouts
für eine moderne Landing Page.

## Struktur

- \`src/app/\` - Next.js App Router Seiten
- \`src/components/\` - Wiederverwendbare Komponenten
- \`src/lib/\` - Utility-Funktionen

## Lizenz

MIT
`

    default:
      return `// ${fileName}\n// Inhalt wird bei echtem GitHub-Sync geladen.`
  }
}
