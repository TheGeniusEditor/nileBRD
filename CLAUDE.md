# CLAUDE.md — BPRM Portal Project

## What this project is

A **Business Process Requirements Management (BPRM) Portal** — a full-stack web app with three role-based portals:
- **Stakeholder Portal** — submit business problems, track requests, approvals, UAT testing
- **Business Analyst Portal** — manage assigned problems, write BRDs/FRDs, user stories
- **IT Portal** — feasibility analysis, dev tracking, SIT, bug tracking, deployment, monitoring
- **Admin Control Panel** — user management, audit logs

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 (`@tailwindcss/postcss`) |
| Icons | Lucide React |
| Charts | Recharts |
| Tables | TanStack React Table |
| UI primitives | Radix UI (checkbox, label, slot) |
| Backend | Node.js + Express.js (ESM), JavaScript |
| Database | PostgreSQL via Neon (cloud) |
| Auth | JWT (7-day expiry), bcryptjs |

---

## Repo structure

```
brd/
├── frontend/               # Next.js app
│   ├── app/
│   │   ├── page.tsx        # Landing/login page
│   │   ├── signup/         # Signup
│   │   ├── stakeholder/    # Stakeholder portal (7 pages)
│   │   ├── ba/             # BA portal (8 pages)
│   │   ├── it/             # IT portal (7 pages)
│   │   └── admin-control-panel/
│   ├── components/
│   │   ├── ui/             # Base components: Button, Card, Input, Textarea, Modal, StatusBadge, AILoader
│   │   ├── dashboard/      # RoleLayout, PortalSidebar, PortalHeader, DashboardCards, ChartWidgets, WorkflowStepper, Timeline
│   │   ├── auth/           # AnimatedLoginPage
│   │   ├── chat/           # Discussion panels
│   │   └── tables/         # DataTable (TanStack)
│   └── lib/
│       ├── mockData.ts     # All mock data for every portal
│       ├── aiMock.ts       # Simulated AI responses
│       └── utils.ts        # cn() and helpers
└── backend/
    ├── server.js           # Express entry (port 5001)
    ├── routes/             # auth.js, admin.js
    ├── middleware/         # auth.js (JWT), adminAuth.js (rate-limit)
    ├── services/           # userService, adminService, auditService
    ├── config/db.js        # Neon PostgreSQL pool
    └── migrations/run.js   # DB schema init
```

---

## Key conventions

- **Path alias**: `@/` maps to `frontend/` root
- **Component style**: Tailwind utility classes only — no CSS modules, no styled-components
- **Card variants**: `default | elevated | outlined | glass | gradient-subtle`
- **Button variants**: `primary | secondary | ghost | danger | success | outline | gradient-primary`
- **Input/Textarea variants**: `default | outlined | subtle`
- **Rounded corners**: `rounded-xl` (inputs/buttons), `rounded-2xl` (cards)
- **Animations**: CSS `animate-in`, `fade-in`, `slide-in-from-*` (Tailwind animate plugin)
- **No backend calls from UI pages** — frontend is fully mock-data-driven except auth (`/api/auth/*`)
- **Mock data lives in**: `frontend/lib/mockData.ts`

---

## Environment variables

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

**Backend** (`.env`):
```
DATABASE_URL=       # Neon PostgreSQL connection string
JWT_SECRET=         # JWT signing secret
FRONTEND_URL=       # CORS origin
PORT=5001
ADMIN_PASSWORD=     # Admin panel password
NODE_ENV=           # development | production
```

---

## Running locally

```bash
# Frontend
cd frontend && npm install && npm run dev   # → http://localhost:3000

# Backend
cd backend && npm install && npm run dev    # → http://localhost:5001
```

---

## Auth flow

- **Users**: signup/login via `/api/auth/signup` and `/api/auth/login` — JWT stored client-side
- **Admin**: password-based via `/api/admin/login` — separate JWT, rate-limited
- **Roles**: `stakeholder`, `ba`, `it` — each routes to their own portal

---

## DB schema (Neon PostgreSQL)

- `users` — id, email (unique), password_hash, role, timestamps
- `auth_logs` — user_id, action, ip_address, user_agent, timestamp
- `admin_audit_logs` — admin_id, action, details (JSONB), timestamp

Run `node backend/migrations/run.js` to initialize schema.

---

## GitHub remote

`https://github.com/TheGeniusEditor/nileBRD.git` (branch: `main`)
