import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.auditLog.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.job.deleteMany()
  await prisma.project.deleteMany()
  await prisma.company.deleteMany()
  await prisma.design.deleteMany()
  await prisma.template.deleteMany()
  await prisma.agent.deleteMany()
  await prisma.integrationSetting.deleteMany()

  const company = await prisma.company.create({
    data: {
      name: "TechVision GmbH",
      website: "https://techvision.example",
      industry: "SaaS",
      brandTone: "Modern, klare Sprache",
      colors: JSON.stringify(["#0EA5E9", "#22C55E", "#111827"]),
      notes: "Demo Company fuer MVP"
    }
  })

  const project = await prisma.project.create({
    data: {
      companyId: company.id,
      name: "Produkt-Launch Q1",
      slug: "produkt-launch-q1",
      objective: "Neue Landingpage fuer Feature-Rollout",
      targetAudience: "B2B Marketing Teams",
      primaryCTA: "Demo anfragen",
      status: "active"
    }
  })

  // ── Designs (15 reichhaltige Designs) ──────────────────────────────────────

  const designA = await prisma.design.create({
    data: {
      name: "SaaS Hero Split",
      description: "Klare Hero-Sektion mit Split-Layout, großem Headline-Text und CTA-Button. Perfekt für SaaS-Landingpages.",
      sourceType: "dribbble",
      sourceUrl: "https://dribbble.com/shots/12345678-saas-hero",
      dribbbleId: "12345678",
      dribbbleUser: "designmaster",
      category: "hero",
      industry: "saas",
      images: JSON.stringify([
        { id: "img1", kind: "cover", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80", width: 1200, height: 800 },
        { id: "img2", kind: "full", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80", width: 1920, height: 1080 },
        { id: "img3", kind: "hero_crop", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", width: 800, height: 400 },
      ]),
      coverImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      screenshotUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      status: "saved",
      dedupeKey: "dribbble:12345678",
      tags: JSON.stringify(["saas", "hero", "split-layout", "modern"]),
      notes: "Klare Hero-Hierarchie mit starkem CTA",
      usesCount: 5,
    }
  })

  const designB = await prisma.design.create({
    data: {
      name: "Minimal Pricing Table",
      description: "Minimalistisches 3-Spalten Pricing mit Toggle für Monats/Jahresabrechnung.",
      sourceType: "dribbble",
      sourceUrl: "https://dribbble.com/shots/87654321-minimal-pricing",
      dribbbleId: "87654321",
      dribbbleUser: "uicraft",
      category: "pricing",
      industry: "saas",
      images: JSON.stringify([
        { id: "img4", kind: "cover", url: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1200&q=80", width: 1200, height: 800 },
      ]),
      coverImageUrl: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1200&q=80",
      screenshotUrl: "https://images.unsplash.com/photo-1551281044-8bf31f2d6f31?w=800&q=80",
      status: "saved",
      dedupeKey: "dribbble:87654321",
      tags: JSON.stringify(["pricing", "minimal", "toggle"]),
      notes: "Starkes Pricing-Modul",
      usesCount: 3,
    }
  })

  await prisma.design.create({
    data: {
      name: "E-Commerce Hero Banner",
      description: "Vollbreiter Hero-Banner mit Produktbild, Sale-Badge und animiertem CTA.",
      sourceType: "web",
      sourceUrl: "https://shopify.design/hero-patterns",
      category: "hero",
      industry: "ecommerce",
      coverImageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80",
      status: "saved",
      dedupeKey: "web:shopify.design/hero-patterns",
      tags: JSON.stringify(["ecommerce", "hero", "banner", "sale"]),
      notes: "Sehr konversionsstarkes Layout",
      usesCount: 8,
    }
  })

  await prisma.design.create({
    data: {
      name: "Kanzlei Trust Section",
      description: "Vertrauensaufbau-Sektion mit Zertifikaten, Bewertungen und Anwaltsprofilbildern.",
      sourceType: "web",
      sourceUrl: "https://lawfirm-templates.com/trust-section",
      category: "testimonials",
      industry: "legal",
      coverImageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80",
      status: "saved",
      dedupeKey: "web:lawfirm-templates.com/trust-section",
      tags: JSON.stringify(["kanzlei", "trust", "bewertungen", "zertifikate"]),
      notes: "Wichtig für Rechtsanwalt-Landingpages",
      usesCount: 2,
    }
  })

  await prisma.design.create({
    data: {
      name: "Dark Mode Dashboard UI",
      description: "Elegantes Dashboard-Design mit Dark Mode, Charts und Sidebar-Navigation.",
      sourceType: "dribbble",
      sourceUrl: "https://dribbble.com/shots/11111111-dark-dashboard",
      dribbbleId: "11111111",
      dribbbleUser: "dashboardking",
      category: "dashboard",
      industry: "saas",
      images: JSON.stringify([
        { id: "img5", kind: "cover", url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80", width: 1200, height: 800 },
        { id: "img6", kind: "full", url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80", width: 1920, height: 1080 },
      ]),
      coverImageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
      status: "candidate",
      dedupeKey: "dribbble:11111111",
      tags: JSON.stringify(["dashboard", "dark-mode", "analytics", "charts"]),
      notes: "Perfekt als Vorlage für Admin-Panels",
      usesCount: 12,
    }
  })

  await prisma.design.create({
    data: {
      name: "Recruiting Hero mit Suchfeld",
      description: "Jobportal-Hero mit prominentem Suchfeld, Standort-Filter und Kategorien.",
      sourceType: "web",
      sourceUrl: "https://recruiting-ui.com/hero",
      category: "hero",
      industry: "recruiting",
      coverImageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80",
      status: "saved",
      dedupeKey: "web:recruiting-ui.com/hero",
      tags: JSON.stringify(["recruiting", "hero", "suchfeld", "jobportal"]),
      usesCount: 1,
    }
  })

  await prisma.design.create({
    data: {
      name: "FinTech Feature Grid",
      description: "Modulares Feature-Grid mit Icons, Gradient-Cards und Hover-Effekten.",
      sourceType: "dribbble",
      sourceUrl: "https://dribbble.com/shots/22222222-fintech-features",
      dribbbleId: "22222222",
      dribbbleUser: "fintechdesign",
      category: "features",
      industry: "fintech",
      coverImageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=1200&q=80",
      status: "saved",
      dedupeKey: "dribbble:22222222",
      tags: JSON.stringify(["fintech", "features", "grid", "gradient"]),
      notes: "Moderne Feature-Darstellung",
      usesCount: 6,
    }
  })

  await prisma.design.create({
    data: {
      name: "FAQ Akkordeon Clean",
      description: "Sauberes FAQ-Akkordeon mit animierten Expand/Collapse Übergängen.",
      sourceType: "local",
      category: "faq",
      coverImageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
      status: "saved",
      tags: JSON.stringify(["faq", "akkordeon", "clean", "animation"]),
      notes: "Eigenes Design – als Referenz gespeichert",
      usesCount: 4,
    }
  })

  await prisma.design.create({
    data: {
      name: "CTA Banner Gradient",
      description: "Auffälliger CTA-Banner mit Gradient-Hintergrund und Countdown-Timer.",
      sourceType: "local",
      category: "cta",
      industry: "saas",
      coverImageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80",
      status: "candidate",
      tags: JSON.stringify(["cta", "banner", "gradient", "countdown"]),
      notes: "Sehr hohe Conversion-Rate",
      usesCount: 7,
    }
  })

  await prisma.design.create({
    data: {
      name: "Agentur Portfolio Masonry",
      description: "Portfolio-Grid im Masonry-Style mit Hover-Overlay und Projekt-Details.",
      sourceType: "web",
      sourceUrl: "https://agency-templates.io/portfolio",
      category: "portfolio",
      industry: "agency",
      coverImageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
      status: "saved",
      dedupeKey: "web:agency-templates.io/portfolio",
      tags: JSON.stringify(["portfolio", "masonry", "agentur", "projekte"]),
      usesCount: 3,
    }
  })

  await prisma.design.create({
    data: {
      name: "Immobilien Listing Cards",
      description: "Property-Listing-Cards mit Bildkarussell, Preis-Badge und Quick-View.",
      sourceType: "web",
      sourceUrl: "https://realestate-ui.com/listings",
      category: "features",
      industry: "realestate",
      coverImageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
      status: "saved",
      dedupeKey: "web:realestate-ui.com/listings",
      tags: JSON.stringify(["immobilien", "listing", "cards", "karussell"]),
      usesCount: 2,
    }
  })

  await prisma.design.create({
    data: {
      name: "Testimonial Carousel Minimal",
      description: "Minimalistisches Testimonial-Karussell mit Avatar, Quote und Rating.",
      sourceType: "dribbble",
      sourceUrl: "https://dribbble.com/shots/33333333-testimonial",
      dribbbleId: "33333333",
      dribbbleUser: "testimonialui",
      category: "testimonials",
      coverImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
      status: "saved",
      dedupeKey: "dribbble:33333333",
      tags: JSON.stringify(["testimonials", "carousel", "minimal", "social-proof"]),
      usesCount: 9,
    }
  })

  await prisma.design.create({
    data: {
      name: "E-Commerce Footer Complex",
      description: "Umfangreicher Footer mit Newsletter-Signup, Social Links, Sitemap und Trust-Badges.",
      sourceType: "local",
      category: "footer",
      industry: "ecommerce",
      coverImageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
      status: "archived",
      tags: JSON.stringify(["footer", "newsletter", "ecommerce", "trust"]),
      notes: "Archiviert – zu komplex für die meisten Projekte",
      usesCount: 1,
    }
  })

  await prisma.design.create({
    data: {
      name: "SaaS Onboarding Flow",
      description: "Multi-Step Onboarding mit Progress-Bar, Animationen und konfettiartiger Completion.",
      sourceType: "dribbble",
      sourceUrl: "https://dribbble.com/shots/44444444-onboarding",
      dribbbleId: "44444444",
      dribbbleUser: "onboardpro",
      category: "features",
      industry: "saas",
      coverImageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&q=80",
      status: "saved",
      dedupeKey: "dribbble:44444444",
      tags: JSON.stringify(["onboarding", "multi-step", "saas", "animation"]),
      usesCount: 4,
    }
  })

  await prisma.design.create({
    data: {
      name: "Health Blog Header",
      description: "Clean Blog-Header für Gesundheitsbranche mit Featured-Post und Kategorie-Chips.",
      sourceType: "web",
      sourceUrl: "https://health-templates.com/blog-header",
      category: "header",
      industry: "health",
      coverImageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
      status: "saved",
      dedupeKey: "web:health-templates.com/blog-header",
      tags: JSON.stringify(["blog", "header", "gesundheit", "featured"]),
      usesCount: 2,
    }
  })

  // ── Collections (3 Demo-Collections) ──────────────────────────────────────

  const collectionHero = await prisma.collection.create({
    data: {
      name: "Hero Inspirationen",
      description: "Sammlung der besten Hero-Sektionen für verschiedene Branchen",
    }
  })

  const collectionPricing = await prisma.collection.create({
    data: {
      name: "Pricing Patterns",
      description: "Verschiedene Pricing-Table und Card Designs",
    }
  })

  const collectionDarkMode = await prisma.collection.create({
    data: {
      name: "Dark Mode Designs",
      description: "Designs mit Dark Mode Ästhetik als Inspiration",
    }
  })

  // Link designs to collections via designIds JSON
  await prisma.collection.update({
    where: { id: collectionHero.id },
    data: { designIds: JSON.stringify([designA.id]) },
  })

  await prisma.collection.update({
    where: { id: collectionPricing.id },
    data: { designIds: JSON.stringify([designB.id]) },
  })

  // Update designs with collectionIds
  await prisma.design.update({
    where: { id: designA.id },
    data: { collectionIds: JSON.stringify([collectionHero.id]) },
  })

  await prisma.design.update({
    where: { id: designB.id },
    data: { collectionIds: JSON.stringify([collectionPricing.id]) },
  })

  // ── ImportJobs (4 Demo-ImportJobs) ────────────────────────────────────────

  await prisma.importJob.create({
    data: {
      type: "web_crawl",
      inputData: JSON.stringify({ url: "https://stripe.com/payments" }),
      status: "done",
      resultDesignId: designA.id,
      completedAt: new Date(),
    }
  })

  await prisma.importJob.create({
    data: {
      type: "dribbble_sync",
      inputData: JSON.stringify({ url: "https://dribbble.com/shots/99999999", shotId: "99999999" }),
      status: "queued",
    }
  })

  await prisma.importJob.create({
    data: {
      type: "web_crawl",
      inputData: JSON.stringify({ url: "https://example-law.com" }),
      status: "running",
    }
  })

  await prisma.importJob.create({
    data: {
      type: "dribbble_sync",
      inputData: JSON.stringify({ url: "https://dribbble.com/shots/00000000", shotId: "00000000" }),
      status: "error",
      errorMessage: "Rate limit exceeded – bitte später erneut versuchen.",
    }
  })

  // ── Templates (Katalog) ──────────────────────────────────────────────────

  const projectTree = JSON.stringify([
    { name: "src", type: "folder", path: "src", children: [
      { name: "app", type: "folder", path: "src/app", children: [
        { name: "layout.tsx", type: "file", path: "src/app/layout.tsx" },
        { name: "page.tsx", type: "file", path: "src/app/page.tsx" },
        { name: "globals.css", type: "file", path: "src/app/globals.css" },
      ]},
      { name: "components", type: "folder", path: "src/components", children: [
        { name: "Hero.tsx", type: "file", path: "src/components/Hero.tsx" },
        { name: "Features.tsx", type: "file", path: "src/components/Features.tsx" },
        { name: "Pricing.tsx", type: "file", path: "src/components/Pricing.tsx" },
        { name: "FAQ.tsx", type: "file", path: "src/components/FAQ.tsx" },
        { name: "Footer.tsx", type: "file", path: "src/components/Footer.tsx" },
        { name: "Header.tsx", type: "file", path: "src/components/Header.tsx" },
        { name: "CTA.tsx", type: "file", path: "src/components/CTA.tsx" },
      ]},
      { name: "lib", type: "folder", path: "src/lib", children: [
        { name: "utils.ts", type: "file", path: "src/lib/utils.ts" },
        { name: "constants.ts", type: "file", path: "src/lib/constants.ts" },
      ]},
    ]},
    { name: "public", type: "folder", path: "public", children: [
      { name: "favicon.ico", type: "file", path: "public/favicon.ico" },
      { name: "og-image.png", type: "file", path: "public/og-image.png" },
    ]},
    { name: "README.md", type: "file", path: "README.md" },
    { name: "package.json", type: "file", path: "package.json" },
    { name: "tsconfig.json", type: "file", path: "tsconfig.json" },
    { name: "tailwind.config.ts", type: "file", path: "tailwind.config.ts" },
    { name: "next.config.ts", type: "file", path: "next.config.ts" },
  ])

  const sectionTree = (name: string) => JSON.stringify([
    { name: "src", type: "folder", path: "src", children: [
      { name: `${name}.tsx`, type: "file", path: `src/${name}.tsx` },
      { name: `${name}.module.css`, type: "file", path: `src/${name}.module.css` },
      { name: "index.ts", type: "file", path: "src/index.ts" },
    ]},
    { name: "README.md", type: "file", path: "README.md" },
    { name: "package.json", type: "file", path: "package.json" },
  ])

  const componentTree = (name: string) => JSON.stringify([
    { name: "src", type: "folder", path: "src", children: [
      { name: `${name}.tsx`, type: "file", path: `src/${name}.tsx` },
      { name: `${name}.stories.tsx`, type: "file", path: `src/${name}.stories.tsx` },
      { name: "index.ts", type: "file", path: "src/index.ts" },
      { name: "types.ts", type: "file", path: "src/types.ts" },
    ]},
    { name: "README.md", type: "file", path: "README.md" },
    { name: "package.json", type: "file", path: "package.json" },
  ])

  const templateA = await prisma.template.create({
    data: {
      name: "SaaS Landing Pro",
      slug: "saas-landing-pro",
      description: "Vollständiges SaaS Landing Page Template mit Hero, Features, Pricing, FAQ und Footer.",
      type: "project",
      framework: "nextjs",
      uiStack: "tailwind",
      tags: JSON.stringify(["saas", "landing", "conversion", "tailwind"]),
      layoutCode: "<section><h1>{{title}}</h1><p>{{subtitle}}</p><a href='#cta'>{{cta}}</a></section>",
      placeholdersSchema: JSON.stringify({ title: "", subtitle: "", cta: "" }),
      previewImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      sourceMode: "github",
      repoFullName: "techvision/saas-landing-pro",
      defaultBranch: "main",
      templateRootPath: "/",
      entryFile: "src/app/page.tsx",
      syncStatus: "synced",
      lastSyncAt: new Date(),
      lastCommitSha: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
      fileTreeSnapshot: projectTree,
      usesCount: 12,
    }
  })

  await prisma.template.create({
    data: {
      name: "E-Commerce Starter",
      slug: "ecommerce-starter",
      description: "Next.js E-Commerce Starter mit Produktseiten, Warenkorb und Checkout Flow.",
      type: "project",
      framework: "nextjs",
      uiStack: "shadcn",
      tags: JSON.stringify(["ecommerce", "shop", "next.js", "shadcn"]),
      previewImageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80",
      sourceMode: "github",
      repoFullName: "techvision/ecommerce-starter",
      defaultBranch: "main",
      templateRootPath: "/",
      entryFile: "src/app/page.tsx",
      syncStatus: "synced",
      lastSyncAt: new Date(),
      lastCommitSha: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1",
      fileTreeSnapshot: projectTree,
      usesCount: 8,
    }
  })

  await prisma.template.create({
    data: {
      name: "Portfolio Minimal",
      slug: "portfolio-minimal",
      description: "Minimalistisches Portfolio Template mit About, Projekte und Kontakt.",
      type: "project",
      framework: "react",
      uiStack: "tailwind",
      tags: JSON.stringify(["portfolio", "minimal", "personal"]),
      previewImageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
      sourceMode: "local",
      layoutCode: "<main><section id='about'>{{about}}</section><section id='projects'>{{projects}}</section></main>",
      placeholdersSchema: JSON.stringify({ about: "", projects: "" }),
      syncStatus: "none",
      usesCount: 3,
    }
  })

  await prisma.template.create({
    data: {
      name: "Hero Gradient",
      slug: "hero-gradient",
      description: "Moderner Hero mit Gradient-Hintergrund, CTA-Button und Trust-Badges.",
      type: "section",
      category: "hero",
      framework: "nextjs",
      uiStack: "tailwind",
      tags: JSON.stringify(["hero", "gradient", "cta", "modern"]),
      previewImageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&q=80",
      sourceMode: "github",
      repoFullName: "techvision/ui-sections",
      defaultBranch: "main",
      templateRootPath: "/sections/hero-gradient",
      entryFile: "src/Hero.tsx",
      syncStatus: "synced",
      lastSyncAt: new Date(),
      lastCommitSha: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2",
      fileTreeSnapshot: sectionTree("Hero"),
      usesCount: 24,
    }
  })

  await prisma.template.create({
    data: {
      name: "Pricing Cards",
      slug: "pricing-cards",
      description: "3-Spalten Pricing-Vergleich mit Highlight-Plan, Toggle Monthly/Yearly.",
      type: "section",
      category: "pricing",
      framework: "nextjs",
      uiStack: "shadcn",
      tags: JSON.stringify(["pricing", "cards", "comparison", "toggle"]),
      previewImageUrl: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1200&q=80",
      sourceMode: "github",
      repoFullName: "techvision/ui-sections",
      defaultBranch: "main",
      templateRootPath: "/sections/pricing-cards",
      entryFile: "src/Pricing.tsx",
      syncStatus: "out_of_sync",
      lastSyncAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastCommitSha: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3",
      fileTreeSnapshot: sectionTree("Pricing"),
      usesCount: 18,
    }
  })

  await prisma.template.create({
    data: {
      name: "FAQ Accordion",
      slug: "faq-accordion",
      description: "Animiertes FAQ-Akkordeon mit Schema.org JSON-LD fuer SEO.",
      type: "section",
      category: "faq",
      framework: "nextjs",
      uiStack: "tailwind",
      tags: JSON.stringify(["faq", "accordion", "seo", "schema.org"]),
      previewImageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
      sourceMode: "local",
      layoutCode: "<section class='faq'><h2>{{title}}</h2><div class='accordion'>{{items}}</div></section>",
      placeholdersSchema: JSON.stringify({ title: "Häufige Fragen", items: "" }),
      syncStatus: "none",
      usesCount: 15,
    }
  })

  await prisma.template.create({
    data: {
      name: "Testimonial Carousel",
      slug: "testimonial-carousel",
      description: "Auto-scrollendes Testimonial-Karussell mit Avatar, Name und Bewertung.",
      type: "component",
      category: "testimonials",
      framework: "react",
      uiStack: "tailwind",
      tags: JSON.stringify(["testimonials", "carousel", "social-proof", "slider"]),
      previewImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
      sourceMode: "github",
      repoFullName: "techvision/ui-components",
      defaultBranch: "main",
      templateRootPath: "/components/testimonial-carousel",
      entryFile: "src/TestimonialCarousel.tsx",
      syncStatus: "synced",
      lastSyncAt: new Date(),
      lastCommitSha: "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4",
      fileTreeSnapshot: componentTree("TestimonialCarousel"),
      usesCount: 9,
    }
  })

  await prisma.template.create({
    data: {
      name: "Feature Grid",
      slug: "feature-grid",
      description: "Responsives Feature-Grid mit Icons, Titeln und Beschreibungen.",
      type: "component",
      category: "features",
      framework: "nextjs",
      uiStack: "shadcn",
      tags: JSON.stringify(["features", "grid", "icons", "responsive"]),
      previewImageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
      sourceMode: "github",
      repoFullName: "techvision/ui-components",
      defaultBranch: "main",
      templateRootPath: "/components/feature-grid",
      entryFile: "src/FeatureGrid.tsx",
      syncStatus: "error",
      lastSyncAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      lastCommitSha: "f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5",
      syncErrorMessage: "Rate limit exceeded. Bitte später erneut versuchen.",
      fileTreeSnapshot: componentTree("FeatureGrid"),
      usesCount: 14,
    }
  })

  await prisma.template.create({
    data: {
      name: "CTA Banner",
      slug: "cta-banner",
      description: "Auffälliger Call-to-Action Banner mit Gradient und Countdown.",
      type: "section",
      category: "cta",
      framework: "html",
      tags: JSON.stringify(["cta", "banner", "gradient", "countdown"]),
      previewImageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80",
      sourceMode: "local",
      layoutCode: "<section class='cta-banner'><h2>{{headline}}</h2><p>{{subtext}}</p><a href='{{link}}'>{{buttonText}}</a></section>",
      placeholdersSchema: JSON.stringify({ headline: "", subtext: "", link: "#", buttonText: "Jetzt starten" }),
      syncStatus: "none",
      usesCount: 6,
    }
  })

  const templateB = templateA // for backward compat in job seed

  const job = await prisma.job.create({
    data: {
      projectId: project.id,
      templateId: templateA.id,
      designId: designA.id,
      status: "done",
      inputJson: JSON.stringify({ title: "Launch your pipeline", subtitle: "Automate landing pages", cta: "Start now" }),
      outputJson: JSON.stringify({ report: "Demo workflow completed" }),
      logs: "Seeded demo job executed successfully.",
      previewUrl: "https://preview.local/jobs/demo",
      steps: JSON.stringify([
        { name: "Validate", state: "done" },
        { name: "Content", state: "done" },
        { name: "Visuals", state: "done" },
        { name: "Code", state: "done" },
        { name: "Upload", state: "done" },
        { name: "Report", state: "done" }
      ]),
      startedAt: new Date(),
      completedAt: new Date()
    }
  })

  await prisma.asset.createMany({
    data: [
      // ── Reports ──
      {
        projectId: project.id,
        jobId: job.id,
        type: "report",
        storageKey: "reports/demo-report.json",
        publicUrl: "https://minio.local/reports/demo-report.json",
        meta: JSON.stringify({ generatedBy: "seed", version: "1.0", pages: 12 })
      },
      {
        projectId: project.id,
        jobId: job.id,
        type: "report",
        storageKey: "reports/lighthouse-audit.json",
        publicUrl: "https://minio.local/reports/lighthouse-audit.json",
        meta: JSON.stringify({ tool: "Lighthouse", score: { performance: 94, accessibility: 100, seo: 92 } })
      },
      // ── Images ──
      {
        projectId: project.id,
        type: "image",
        storageKey: "images/hero-reference.png",
        publicUrl: "https://picsum.photos/seed/hero/800/400",
        meta: JSON.stringify({ source: "design-reference", width: 800, height: 400 })
      },
      {
        projectId: project.id,
        type: "image",
        storageKey: "images/og-image.png",
        publicUrl: "https://picsum.photos/seed/og/1200/630",
        meta: JSON.stringify({ purpose: "Open Graph", width: 1200, height: 630 })
      },
      {
        projectId: project.id,
        type: "image",
        storageKey: "images/logos/logo-dark.svg",
        publicUrl: "https://minio.local/images/logos/logo-dark.svg",
        meta: JSON.stringify({ variant: "dark", format: "svg" })
      },
      {
        projectId: project.id,
        type: "image",
        storageKey: "images/logos/logo-light.svg",
        publicUrl: "https://minio.local/images/logos/logo-light.svg",
        meta: JSON.stringify({ variant: "light", format: "svg" })
      },
      {
        projectId: project.id,
        type: "image",
        storageKey: "images/icons/favicon-32.png",
        publicUrl: "https://picsum.photos/seed/fav/32/32",
        meta: JSON.stringify({ size: "32x32" })
      },
      {
        projectId: project.id,
        type: "image",
        storageKey: "images/screenshots/desktop-hero.png",
        publicUrl: "https://picsum.photos/seed/dh/1440/900",
        meta: JSON.stringify({ viewport: "desktop", section: "hero" })
      },
      {
        projectId: project.id,
        type: "image",
        storageKey: "images/screenshots/mobile-hero.png",
        publicUrl: "https://picsum.photos/seed/mh/375/812",
        meta: JSON.stringify({ viewport: "mobile", section: "hero" })
      },
      // ── HTML ──
      {
        projectId: project.id,
        jobId: job.id,
        type: "html",
        storageKey: "build/index.html",
        publicUrl: "https://minio.local/build/index.html",
        meta: JSON.stringify({ generator: "next-export", buildTime: "4.2s" })
      },
      {
        projectId: project.id,
        type: "html",
        storageKey: "build/preview.html",
        publicUrl: "https://minio.local/build/preview.html",
        meta: JSON.stringify({ generator: "template-engine" })
      },
      // ── Bundles ──
      {
        projectId: project.id,
        jobId: job.id,
        type: "bundle",
        storageKey: "build/assets/main.js",
        publicUrl: "https://minio.local/build/assets/main.js",
        meta: JSON.stringify({ size: "128KB", minified: true })
      },
      {
        projectId: project.id,
        type: "bundle",
        storageKey: "build/assets/styles.css",
        publicUrl: "https://minio.local/build/assets/styles.css",
        meta: JSON.stringify({ size: "24KB", minified: true })
      },
      // ── Video ──
      {
        projectId: project.id,
        type: "video",
        storageKey: "media/product-demo.mp4",
        publicUrl: "https://minio.local/media/product-demo.mp4",
        meta: JSON.stringify({ duration: "1:32", resolution: "1920x1080" })
      },
      // ── Documents ──
      {
        projectId: project.id,
        type: "document",
        storageKey: "docs/brand-guidelines.pdf",
        publicUrl: "https://minio.local/docs/brand-guidelines.pdf",
        meta: JSON.stringify({ pages: 24, version: "2.1" })
      },
      {
        projectId: project.id,
        type: "document",
        storageKey: "docs/content-brief.md",
        publicUrl: "https://minio.local/docs/content-brief.md",
        meta: JSON.stringify({ format: "markdown" })
      },
    ]
  })

  // ── 🧠 1. Content- & Thought-Leader-Automationen ──────────────────────

  await prisma.agent.createMany({
    data: [
      {
        name: "Daily Industry Intelligence Engine",
        type: "content",
        modelHint: "gpt-4.1",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Automatisierte Branchenanalyse (Recht, KI, Recruiting, Gerüstbau, Bahnsicherung etc.)",
          workflow: ["RSS + News APIs", "AI Zusammenfassung", "Keyword Extraction", "Trendbewertung", "LinkedIn Mini-Post", "Interne Notiz in Dashboard"],
          output: ["Heute relevant", "Blog-Vorlagen", "Social Hooks", "YouTube-Skriptideen"],
          kategorie: "Content & Thought-Leader"
        })
      },
      {
        name: "Multi-Format Content Transformer",
        type: "content",
        modelHint: "gpt-4.1",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "1 Blog → automatisch LinkedIn Post, Instagram Carousel, Twitter Thread, YouTube Short Script, Newsletter, SEO Meta Description",
          inputFormat: "blog_markdown",
          outputFormate: ["linkedin_post", "instagram_carousel", "twitter_thread", "youtube_short_script", "newsletter", "seo_meta"],
          kategorie: "Content & Thought-Leader"
        })
      },
      {
        name: "Evergreen Content Recycler",
        type: "content",
        modelHint: "gpt-4.1-mini",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Prüft alte Blogs auf Performance & Google-Rankings, erstellt automatisch Rewrites mit neuen Keywords und plant Reposts",
          pruefungen: ["Welche alten Blogs performen gut?", "Welche ranken bei Google?", "Welche kann man updaten?"],
          aktionen: ["Automatisch Rewrite", "Neue Keywords einbauen", "Repost planen"],
          kategorie: "Content & Thought-Leader"
        })
      },
      {
        name: "Personal Brand Builder",
        type: "content",
        modelHint: "gpt-4.1",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Dokumentiert Projekte, extrahiert Learnings, erstellt Founder Stories und Case Studies",
          aktionen: ["Projekte dokumentieren", "Learnings extrahieren", "Founder Stories erstellen", "Case Studies generieren"],
          hinweis: "Sehr wichtig für 10.000€ mtl.-Strategie",
          kategorie: "Content & Thought-Leader"
        })
      },

      // ── ⚙️ 2. Infrastruktur- & KI-Projekte ──────────────────────────

      {
        name: "Agent Marketplace Builder",
        type: "code",
        modelHint: "claude-4-sonnet",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Internes System mit spezialisierten Agenten – langfristig verkaufbar",
          agenten: ["Landingpage Builder Agent", "Blog Agent", "CRM Setup Agent", "Funnel Agent", "Security Audit Agent"],
          dashboard: "Agent-Verwaltung",
          kategorie: "Infrastruktur & KI"
        })
      },
      {
        name: "Model Routing Automatisierung",
        type: "code",
        modelHint: "gpt-4.1",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Intelligentes LLM-Routing mit automatischem Kosten- & Qualitätsmanagement",
          routing: { "Claude": "Schreiben", "GPT": "Code", "Local Ollama": "interne Daten", "Gemini": "Bilder" },
          features: ["Automatisches Kosten-Management", "Qualitätsmanagement", "Fallback-Routing"],
          kategorie: "Infrastruktur & KI"
        })
      },
      {
        name: "Docker Deployment Automatisierung",
        type: "code",
        modelHint: "claude-4-sonnet",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Ein Klick → Neues SaaS Produkt",
          workflow: ["Repo erstellen", "Dockerfile generieren", "CI/CD Setup", "Domain verbinden", "Reverse Proxy konfigurieren", "SSL einrichten"],
          kategorie: "Infrastruktur & KI"
        })
      },
      {
        name: "KI-Quality-Check Agent",
        type: "qc",
        modelHint: "gpt-4.1",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Überprüft alles bevor es live geht",
          pruefungen: ["Code Qualität", "Sicherheitslücken", "DSGVO-Risiken", "SEO-Score", "Performance"],
          kategorie: "Infrastruktur & KI"
        })
      },

      // ── 💰 3. Monetarisierungs-Automationen ──────────────────────────

      {
        name: "Funnel-Factory System",
        type: "content",
        modelHint: "gpt-4.1",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Generiert automatisch komplette Lead-Funnels",
          output: ["Nischen-Landingpages", "SEO Content", "Formular", "Webhook zu n8n", "Follow-up Mail", "CRM Eintrag"],
          ziel: "Leadmaschinen aufbauen",
          kategorie: "Monetarisierung"
        })
      },
      {
        name: "Abo-Conversion Optimizer",
        type: "content",
        modelHint: "gpt-4.1-mini",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Analysiert Kundenverhalten und optimiert Conversion zu Abos",
          analysen: ["Welche Kunden kaufen einmalig?", "Welche könnten in Wartungsvertrag?", "Welche könnten KI-Abo bekommen?"],
          aktion: "Automatische Angebots-E-Mail",
          kategorie: "Monetarisierung"
        })
      },
      {
        name: "Upsell Recommendation Engine",
        type: "content",
        modelHint: "gpt-4.1-mini",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Automatisch generierte Upsell-Angebote für Bestandskunden",
          beispiele: { "Gerüstbauer": "Zeiterfassung Upsell", "Kanzlei": "KI-Chatbot", "Personalvermittlung": "Matching Bot" },
          kategorie: "Monetarisierung"
        })
      },

      // ── 🏢 4. Kundenautomatisierungs-Projekte ────────────────────────

      {
        name: "Auto-CRM Setup für Neukunden",
        type: "code",
        modelHint: "claude-4-sonnet",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Wenn neuer Kunde unterschreibt → alles automatisiert einrichten",
          schritte: ["GitHub Repo", "Hosting Setup", "n8n Flow", "CRM Instanz", "E-Mail Einrichtung", "DNS Setup", "Projektordner"],
          kategorie: "Kundenautomatisierung"
        })
      },
      {
        name: "Vertrags- & Rechnungs-Generator",
        type: "content",
        modelHint: "gpt-4.1",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Erstellt Dokumente mit Template Engine",
          dokumentTypen: ["Angebote", "Verträge", "AGB", "Wartungsverträge", "Hostingverträge"],
          kategorie: "Kundenautomatisierung"
        })
      },
      {
        name: "Kunden-Health-Score Dashboard",
        type: "qc",
        modelHint: "gpt-4.1-mini",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Automatisches Tracking mit Ampelsystem",
          metriken: ["Traffic", "Serverlast", "Lead-Zahlen", "Social-Reichweite", "Conversion Rate"],
          ampel: { "gruen": "Gesund", "gelb": "Optimieren", "rot": "Eingreifen" },
          kategorie: "Kundenautomatisierung"
        })
      },

      // ── 📊 5. Analyse & Strategie-Automationen ────────────────────────

      {
        name: "Wettbewerbsanalyse Bot",
        type: "content",
        modelHint: "gpt-4.1",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Erstellt Strategieberichte pro Branche",
          analysen: ["Webseiten Scraping", "SEO Analyse", "Tech Stack Analyse", "Funnel Struktur Analyse"],
          output: "Strategiebericht",
          kategorie: "Analyse & Strategie"
        })
      },
      {
        name: "Revenue Forecast Engine",
        type: "content",
        modelHint: "gpt-4.1-mini",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Automatische Gewinnprognose – wichtig für Bankgespräche",
          datenquellen: ["Abo-Einnahmen", "Projektvolumen", "Serverkosten", "Ads Budget"],
          output: "Gewinnprognose",
          kategorie: "Analyse & Strategie"
        })
      },
      {
        name: "SEO Nischen-Scanner",
        type: "content",
        modelHint: "gpt-4.1-mini",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Scannt Branchen und erstellt Landingpage-Ideen-Liste",
          analysen: ["Branchen", "Suchvolumen", "Wettbewerb", "CPC"],
          output: "Landingpage-Ideen-Liste",
          kategorie: "Analyse & Strategie"
        })
      },
      {
        name: "AI-Produktideen Generator",
        type: "content",
        modelHint: "gpt-4.1",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Analysiert Kundenprobleme und Branchenlücken, erstellt neue SaaS-Idee-Vorschläge",
          analysen: ["Kundenprobleme", "Branchenlücken", "Wiederkehrende Aufgaben"],
          output: "Neue SaaS Idee Vorschläge",
          kategorie: "Analyse & Strategie"
        })
      },

      // ── 🚀 High-Level Vision Projekt ──────────────────────────────────

      {
        name: "Self-Building Company System",
        type: "code",
        modelHint: "gpt-4.1",
        enabled: true,
        config: JSON.stringify({
          beschreibung: "Selbstwachsende KI-Company – die langfristige Vision",
          pipeline: ["Content erstellt Leads", "Leads landen im CRM", "CRM triggert Agenten", "Agenten erstellen Angebote", "Dashboard zeigt Wachstum"],
          kategorie: "High-Level Vision"
        })
      }
    ]
  })

  await prisma.integrationSetting.createMany({
    data: [
      { provider: "github", config: JSON.stringify({ repo: "", token: "", webhookSecret: "" }) },
      { provider: "openai", config: JSON.stringify({ apiKey: "", model: "gpt-4.1-mini" }) },
      { provider: "minio", config: JSON.stringify({ endpoint: "", accessKey: "", secretKey: "", bucket: "", publicBaseUrl: "" }) },
      { provider: "telegram", config: JSON.stringify({ botToken: "", chatId: "" }) },
      { provider: "system", config: JSON.stringify({ auditRetentionDays: 30 }) }
    ]
  })

  await prisma.auditLog.create({
    data: {
      actor: "seed",
      entityType: "Seed",
      entityId: "initial",
      action: "create",
      payload: JSON.stringify({
        companyId: company.id,
        projectId: project.id,
        designIds: [designA.id, designB.id],
        templateIds: [templateA.id, templateB.id]
      })
    }
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
