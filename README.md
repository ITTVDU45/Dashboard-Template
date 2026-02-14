# Landingpage Pipeline Dashboard (MVP)

Modernes Admin-Dashboard auf Basis von Next.js App Router, TypeScript, Tailwind und Prisma (SQLite).

## Features

- Sidebar Navigation mit 9 Bereichen:
  - Overview
  - Companies
  - Projects
  - Designs (Inspiration)
  - Templates
  - Workflows / Jobs
  - Assets
  - Agents
  - Settings
- CRUD-Flow fuer:
  - Companies, Projects, Designs, Templates, Jobs, Assets, Agents, Integration Settings
- Workflow Wizard (6 Schritte) + Job-Run Stub (`/api/jobs/run`)
- Job Detail mit Timeline, Logs, Input/Output JSON und Preview URL
- Audit Logging bei allen Create/Update/Delete-Aktionen
- Einfache Password-Auth via `.env` + Cookie Session
- Seed Script mit Demo-Daten

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- TailwindCSS + shadcn/ui Komponenten
- Prisma ORM + SQLite (spaeter leicht auf Postgres migrierbar)
- Zod Validierung (Client + Server)

## Setup

1. Abhaengigkeiten installieren

```bash
npm install
```

2. ENV anlegen

```bash
cp .env.example .env
```

3. Prisma Client + Migration

```bash
npm run db:generate
npm run db:migrate -- --name init
```

4. Seed Daten einspielen

```bash
npm run db:seed
```

5. Dev Server starten

```bash
npm run dev
```

Login: `/login` mit `ADMIN_PASSWORD` aus `.env`.

## Architektur Kurzueberblick

- `src/app/(dashboard)/*`: Dashboard-Seiten
- `src/app/api/*`: Route Handlers (CRUD + Workflow-Endpunkte)
- `src/components/common/*`: Reusable UI (DataTable, PageHeader, EmptyState, StatusBadge, Wizard)
- `src/components/forms/*`: Form-Komponenten pro Entity
- `src/lib/*`: Prisma Client, Validation, Audit, Serializer, API-Helper
- `prisma/schema.prisma`: Datenmodell
- `prisma/seed.ts`: Demo-Daten

## Design Tokens

- Colors via CSS Variablen in `src/styles/globals.css`
- Glass/Surface Utilities:
  - `.glass-card`
  - `.surface-card`
  - `.text-gradient`
- Radius + Shadow via Tailwind Config (`tailwind.config.ts`)

## Change-Safety Checkliste

Wenn du etwas umbenennst (Komponente, Prop, Route, Utility, ENV-Key), dann immer:

1. Projektweit nach Verwendungen suchen
2. API + Form + Detailseite konsistent anpassen
3. `npm run typecheck` ausfuehren
4. `npm run lint` ausfuehren
5. Falls Datenmodell geaendert: neue Prisma Migration + ggf. Seed anpassen
