import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { fail, ok } from "@/lib/api-helpers"

/**
 * POST /api/templates/:id/sync
 *
 * MVP: Simulates a GitHub sync by:
 * 1. Setting syncStatus to "syncing"
 * 2. Waiting briefly
 * 3. Generating a fake commit SHA
 * 4. Setting syncStatus to "synced" + updating lastSyncAt/lastCommitSha
 *
 * In the future, this will call the GitHub API to fetch the repo tree.
 */
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const template = await prisma.template.findUnique({ where: { id } })
  if (!template) return fail("Template not found", 404)
  if (template.sourceMode !== "github") {
    return fail("Sync ist nur für GitHub-Templates verfügbar", 400)
  }

  // 1. Set syncing
  await prisma.template.update({
    where: { id },
    data: { syncStatus: "syncing", syncErrorMessage: null },
  })

  // 2. Simulate sync delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // 3. Generate demo data
  const fakeCommitSha =
    Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")

  // 4. Generate a demo file tree based on template type
  const demoTree = generateDemoTree(template.type, template.category)

  // 5. Update to synced
  const updated = await prisma.template.update({
    where: { id },
    data: {
      syncStatus: "synced",
      lastSyncAt: new Date(),
      lastCommitSha: fakeCommitSha,
      fileTreeSnapshot: JSON.stringify(demoTree),
    },
  })

  await createAuditLog({
    entityType: "Template",
    entityId: id,
    action: "sync",
    payload: { commitSha: fakeCommitSha },
  })

  return ok(updated)
}

// ── Demo Tree Generator ──────────────────────────────────────────────────────

function generateDemoTree(type: string, category: string | null) {
  if (type === "project") {
    return [
      {
        name: "src",
        type: "folder",
        path: "src",
        children: [
          {
            name: "app",
            type: "folder",
            path: "src/app",
            children: [
              { name: "layout.tsx", type: "file", path: "src/app/layout.tsx" },
              { name: "page.tsx", type: "file", path: "src/app/page.tsx" },
              { name: "globals.css", type: "file", path: "src/app/globals.css" },
            ],
          },
          {
            name: "components",
            type: "folder",
            path: "src/components",
            children: [
              { name: "Hero.tsx", type: "file", path: "src/components/Hero.tsx" },
              { name: "Features.tsx", type: "file", path: "src/components/Features.tsx" },
              { name: "Pricing.tsx", type: "file", path: "src/components/Pricing.tsx" },
              { name: "Footer.tsx", type: "file", path: "src/components/Footer.tsx" },
              { name: "Header.tsx", type: "file", path: "src/components/Header.tsx" },
            ],
          },
          {
            name: "lib",
            type: "folder",
            path: "src/lib",
            children: [
              { name: "utils.ts", type: "file", path: "src/lib/utils.ts" },
              { name: "constants.ts", type: "file", path: "src/lib/constants.ts" },
            ],
          },
        ],
      },
      {
        name: "public",
        type: "folder",
        path: "public",
        children: [
          { name: "favicon.ico", type: "file", path: "public/favicon.ico" },
          { name: "og-image.png", type: "file", path: "public/og-image.png" },
        ],
      },
      { name: "README.md", type: "file", path: "README.md" },
      { name: "package.json", type: "file", path: "package.json" },
      { name: "tsconfig.json", type: "file", path: "tsconfig.json" },
      { name: "tailwind.config.ts", type: "file", path: "tailwind.config.ts" },
      { name: "next.config.ts", type: "file", path: "next.config.ts" },
    ]
  }

  if (type === "component") {
    return [
      {
        name: "src",
        type: "folder",
        path: "src",
        children: [
          { name: `${category || "Component"}.tsx`, type: "file", path: `src/${category || "Component"}.tsx` },
          { name: `${category || "Component"}.stories.tsx`, type: "file", path: `src/${category || "Component"}.stories.tsx` },
          { name: "index.ts", type: "file", path: "src/index.ts" },
        ],
      },
      { name: "README.md", type: "file", path: "README.md" },
      { name: "package.json", type: "file", path: "package.json" },
    ]
  }

  // Section
  const sectionName = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Section"
  return [
    {
      name: "src",
      type: "folder",
      path: "src",
      children: [
        { name: `${sectionName}.tsx`, type: "file", path: `src/${sectionName}.tsx` },
        { name: `${sectionName}.module.css`, type: "file", path: `src/${sectionName}.module.css` },
        { name: "index.ts", type: "file", path: "src/index.ts" },
      ],
    },
    { name: "README.md", type: "file", path: "README.md" },
    { name: "package.json", type: "file", path: "package.json" },
  ]
}
