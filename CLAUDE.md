## What this repo does

Web admin panel for Rait. Used by the operator to manage drivers, monitor trips, and view analytics. Desktop only.

**Stack:** React · Vite · TypeScript strict · TanStack Query · React Router v6 · Recharts

---

## Folder structure

```
src/
  pages/
    DashboardPage.tsx       # KPIs: daily trips, revenue, active drivers
    DriversPage.tsx         # Driver list with filters
    DriverDetailPage.tsx    # Profile, docs, trip history, actions (activate/suspend)
    TripsPage.tsx           # Trip list with filters
    TripDetailPage.tsx      # Trip detail view
    AnalyticsPage.tsx       # Charts: trips/day, revenue by period
    FareConfigPage.tsx      # Fare management
  components/
    layout/                 # Sidebar, topbar, base layout
    ui/                     # Shared components (Table, Badge, Modal, etc.)
    charts/                 # Recharts wrappers
  api/
    client.ts               # Axios instance with interceptors (JWT auth)
    drivers.ts              # Driver endpoints
    trips.ts                # Trip endpoints
    analytics.ts            # Analytics endpoints
  hooks/                    # useDrivers, useTrips, usePagination, etc.
  types/                    # TypeScript types shared with the backend
  constants/                # Roles, status labels, status colors
```

---

## Critical rules

**Auth:** the admin panel uses the same backend JWT with `role: 'admin'`. Token is stored in `localStorage` and attached to every request via Axios interceptor. On token expiry → redirect to login.

**Desktop only:** designed for desktop (min-width: 1024px). Do not spend time on responsive layout.

**Sensitive data:** the admin can see `payment_intent_id` and `payment_status`, but never raw card data — Stripe handles that.

**CSV export:** use `papaparse` to convert data to CSV on the client — do not generate the file on the backend.

**TanStack Query:** every API call goes through `useQuery` / `useMutation`. No direct fetches inside components.

---

## Commands

```bash
npm run dev          # Dev server (Vite)
npm run build        # Production build → /dist
npm run preview      # Preview the production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

---

## Pages and features

| Page | What it does |
|------|--------------|
| Dashboard | Daily KPIs: total trips, completed, cancelled, revenue, online drivers |
| Drivers | List with filters (status, verified/unverified) · activate · suspend · view docs |
| Driver detail | Full profile · trip history · average rating |
| Trips | List with filters (date, status, driver, passenger) · export CSV |
| Trip detail | Map with origin/destination · status timeline · payment info |
| Analytics | Trips per day chart · revenue by week/month · active drivers trend |
| Fare config | Edit base fare, per-km rate, per-minute rate, minimum fare |

---

## Minimum agent context

```
Repo: rait-admin (React + Vite + TypeScript)
Web admin panel — desktop only
Auth: JWT with role='admin', Axios interceptor
Data fetching: TanStack Query for all API calls

[Page or component to implement]
[Figma design if available]
[Relevant files pasted below]
```

---

## Current sprint

**Sprint:** [ update each sprint ] · **Page in progress:** [ update each sprint ]
