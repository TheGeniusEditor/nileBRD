# AI Business Requirement Management Portal

Frontend-only prototype built with Next.js App Router and Tailwind CSS.

## Overview

This project simulates an enterprise BRM platform with three role-based portals:

1. Stakeholder Portal
2. Business Analyst Portal
3. IT Portal

All features are frontend-only and use local mock data. AI behavior is simulated with delayed dummy responses in [lib/aiMock.ts](lib/aiMock.ts).

## Tech Stack

1. Next.js 16 (App Router)
2. React 19
3. Tailwind CSS 4
4. Recharts (mock dashboards)
5. Lucide React (iconography)

## Portal Routes

### Landing

1. [/](app/page.tsx)

### Stakeholder Portal

1. [/stakeholder/dashboard](app/stakeholder/dashboard/page.tsx)
2. [/stakeholder/submit-problem](app/stakeholder/submit-problem/page.tsx)
3. [/stakeholder/my-requests](app/stakeholder/my-requests/page.tsx)
4. [/stakeholder/discussions](app/stakeholder/discussions/page.tsx)
5. [/stakeholder/approvals](app/stakeholder/approvals/page.tsx)
6. [/stakeholder/uat-testing](app/stakeholder/uat-testing/page.tsx)
7. [/stakeholder/ai-assistant](app/stakeholder/ai-assistant/page.tsx)

### BA Portal

1. [/ba/dashboard](app/ba/dashboard/page.tsx)
2. [/ba/assigned-problems](app/ba/assigned-problems/page.tsx)
3. [/ba/discussions](app/ba/discussions/page.tsx)
4. [/ba/brd-management](app/ba/brd-management/page.tsx)
5. [/ba/frd-management](app/ba/frd-management/page.tsx)
6. [/ba/user-stories](app/ba/user-stories/page.tsx)
7. [/ba/ai-tools](app/ba/ai-tools/page.tsx)

### IT Portal

1. [/it/dashboard](app/it/dashboard/page.tsx)
2. [/it/feasibility-analysis](app/it/feasibility-analysis/page.tsx)
3. [/it/development-tracking](app/it/development-tracking/page.tsx)
4. [/it/test-cases-sit](app/it/test-cases-sit/page.tsx)
5. [/it/bug-tracking](app/it/bug-tracking/page.tsx)
6. [/it/deployment](app/it/deployment/page.tsx)
7. [/it/monitoring](app/it/monitoring/page.tsx)

## Shared Components

Reusable modules are organized under [components](components):

1. [components/ui](components/ui): cards, buttons, input controls, modal, AI loader, status badges
2. [components/dashboard](components/dashboard): sidebar, header, breadcrumbs, charts, timeline, workflow stepper
3. [components/chat](components/chat): discussion chat panel
4. [components/tables](components/tables): paginated table

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Validation

```bash
npm run lint
npm run build
```

The app is currently configured as a static frontend prototype with no backend integration.
