# TransitOps — Implementation Plan (Team of 2, 8-Hour Build)

**Stack:** Next.js 16 (App Router, Server Actions, Turbopack) · Better Auth (RBAC) · Prisma · Neon Postgres

---

## 1. Folder Structure

The structure is split **vertically by domain** (not by layer). This is the single most important decision for a 2-person team — each person works inside their own domain's action file, component folder, and route folder, so Git conflicts become rare instead of constant.

```
transitops/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                      # shared seed data — both test against this
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx           # role-aware nav shell
│   │   │   ├── dashboard/page.tsx   # KPI overview
│   │   │   ├── vehicles/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── drivers/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── trips/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── maintenance/page.tsx
│   │   │   ├── fuel-expenses/page.tsx
│   │   │   └── reports/page.tsx
│   │   ├── api/auth/[...all]/route.ts   # better-auth handler
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                      # shared primitives — build once, hour 1
│   │   ├── vehicles/
│   │   ├── drivers/
│   │   ├── trips/
│   │   ├── maintenance/
│   │   ├── fuel-expenses/
│   │   └── dashboard/
│   ├── domain/                      # pure business-rule functions, no Prisma
│   │   ├── trip-rules.ts
│   │   ├── maintenance-rules.ts
│   │   └── cost-calc.ts
│   ├── actions/                     # Server Actions — one file per domain
│   │   ├── vehicle.actions.ts
│   │   ├── driver.actions.ts
│   │   ├── trip.actions.ts
│   │   ├── maintenance.actions.ts
│   │   ├── fuel-expense.actions.ts
│   │   └── dashboard.actions.ts
│   ├── validations/                 # zod schemas, shared by form + action
│   └── lib/
│       ├── db.ts                    # Prisma singleton
│       ├── auth.ts / auth-client.ts # better-auth config
│       └── rbac.ts                  # requireRole() guard
├── .env
└── next.config.ts
```

---

## 2. Splitting the Work

Two natural halves of the problem statement map to two people cleanly, with almost zero file overlap after hour 1.

|                | **Person A — Fleet & Compliance**                                                                                                                                                                                      | **Person B — Operations & Finance**                                                                                                                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Owns           | Vehicle Registry, Driver Management, Maintenance workflow, Safety Officer view                                                                                                                                         | Trip lifecycle (Draft→Dispatch→Complete/Cancel), Fuel & Expense logging, Dashboard KPIs, Reports/Financial Analyst view                                                                                                                |
| Files          | `actions/vehicle.actions.ts`, `actions/driver.actions.ts`, `actions/maintenance.actions.ts`, `domain/maintenance-rules.ts`, `app/(dashboard)/vehicles/*`, `app/(dashboard)/drivers/*`, `app/(dashboard)/maintenance/*` | `actions/trip.actions.ts`, `actions/fuel-expense.actions.ts`, `actions/dashboard.actions.ts`, `domain/trip-rules.ts`, `domain/cost-calc.ts`, `app/(dashboard)/trips/*`, `app/(dashboard)/fuel-expenses/*`, `app/(dashboard)/reports/*` |
| Why this split | Vehicle/Driver CRUD are prerequisites — Person A builds them first and they unblock Person B's Trip feature (which queries "available" vehicles/drivers).                                                              | Trip Management is the most rule-heavy, highest-risk piece (5 of the 10 mandatory business rules live here) — it deserves one owner end-to-end instead of shared context-switching.                                                    |

### Hour-by-hour

| Hour    | Both together                                                                                                   | Person A                                                       | Person B                                               |
| ------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| 0–1     | Repo init, `schema.prisma` (freeze it here), Neon push, Better Auth + RBAC wired, seed script, `ui/` primitives | —                                                              | —                                                      |
| 1–2.5   |                                                                                                                 | Vehicle CRUD                                                   | Driver CRUD                                            |
| 2.5–4.5 |                                                                                                                 | Maintenance workflow + status sync                             | Trip creation + dispatch/complete/cancel + validations |
| 4.5–5.5 |                                                                                                                 | Safety Officer dashboard slice (license expiry, safety scores) | Fuel & Expense logging                                 |
| 5.5–6.5 |                                                                                                                 | Vehicle detail page (history, cost so far)                     | Cost rollup + ROI calc (`cost-calc.ts`)                |
| 6.5–7.5 | Integrate: main Dashboard KPIs (pulls from both domains)                                                        |                                                                |                                                        |
| 7.5–8   | Together: run the Van-05/Alex workflow from the spec end-to-end, fix bugs, seed realistic demo data             |                                                                |                                                        |

**Why Driver CRUD before Trip work:** Person B's Trip feature needs Driver and Vehicle records to exist and the "available" query pattern established — so Person A ships Vehicle+Driver first while Person B scaffolds the Trip UI/schema validation in parallel (not blocked, just can't test dispatch logic until ~hour 2.5).

---

## 3. Git Workflow to Avoid Conflicts

1. **Freeze `schema.prisma` together in hour 0.** This is the one shared file both of you touch. After hour 1, if either of you needs a schema change, say so out loud, one person edits + pushes + runs `prisma db push`, the other pulls before continuing. Never both edit it silently.
2. **Branch per domain**, not per task: `feature/fleet-compliance` (Person A), `feature/ops-finance` (Person B). Commit and push every 30–45 min — small frequent merges beat one giant end-of-day merge.
3. **`domain/` and `lib/` folders are shared but file-owned** — `trip-rules.ts` is Person B's, `maintenance-rules.ts` is Person A's, `lib/rbac.ts` and `lib/db.ts` are written once in hour 0 and rarely touched again.
4. **`components/ui/`** (buttons, tables, dialogs, status badges) — build this together in the first hour so both of you import from the same primitives instead of each inventing your own Button component (this alone prevents a lot of visual inconsistency + merge noise).
5. Merge into `main` at the hour-4.5 and hour-6.5 checkpoints above, not continuously — gives you natural integration testing points.

---

## 4. Feature Flows

### Auth & RBAC

```
Login (email/password via Better Auth)
   → session created with role field (FLEET_MANAGER | DRIVER | SAFETY_OFFICER | FINANCIAL_ANALYST)
   → (dashboard)/layout.tsx reads session, renders nav filtered by role
   → each Server Action calls requireRole(session, [...allowed]) before touching the DB
```

Route-level gating is UX; the `requireRole` check inside every action is what actually enforces it — don't skip the second one.

### Vehicle / Driver CRUD

```
Form submit → zod validation (validations/vehicle.schema.ts)
   → vehicle.actions.ts: createVehicle() checks regNumber uniqueness
   → Prisma insert → revalidate vehicles list
```

Straightforward CRUD — the only rule here is `regNumber` uniqueness (enforced by the `@unique` constraint + a friendly error message on conflict).

### Trip Lifecycle — the core flow

```
1. New Trip form loads
     → queries vehicles WHERE status = AVAILABLE
     → queries drivers WHERE status = AVAILABLE AND licenseExpiry > now AND status != SUSPENDED
     (this single filter is what satisfies "retired/in-shop never appear" and
      "suspended/expired drivers can't be assigned" — no separate check needed at this stage)

2. Submit → createTrip() → domain/trip-rules.ts: cargoWeight <= vehicle.maxLoadKg
     → Trip row created, status = DRAFT

3. Dispatch button → dispatchTrip(tripId)
     → trip-rules.canDispatch() re-validates (never trust stale form data)
     → prisma.$transaction:
         updateMany(vehicle, WHERE status=AVAILABLE → SET ON_TRIP)   // conditional, not blind
         updateMany(driver,  WHERE status=AVAILABLE → SET ON_TRIP)
         if either count === 0 → throw (someone else grabbed it first) → rollback
         else → trip.status = DISPATCHED

4. Complete trip → completeTrip(tripId, finalOdometer, fuelConsumed)
     → transaction: trip.status = COMPLETED, vehicle.status = AVAILABLE,
       driver.status = AVAILABLE, vehicle.odometer = finalOdometer

5. Cancel (only from DISPATCHED) → cancelTrip(tripId)
     → transaction: trip.status = CANCELLED, vehicle.status = AVAILABLE, driver.status = AVAILABLE
```

The conditional `updateMany` in step 3 (rather than read-then-write) is what makes this safe if two dispatches race — covered in the earlier scalability discussion.

### Maintenance

```
Create maintenance record (vehicle, description, cost)
   → transaction: MaintenanceLog{isActive: true} created + vehicle.status = IN_SHOP
   → vehicle now excluded from Trip's "available" query automatically

Close maintenance
   → MaintenanceLog{isActive: false, closedAt: now}
   → vehicle.status = AVAILABLE, unless vehicle.status was RETIRED (stays RETIRED)
```

### Fuel & Expense → Cost Rollup

```
Log fuel (vehicle, liters, cost, date) or expense (vehicle, type, amount, date)
   → simple insert, no status side-effects

cost-calc.ts:
   operationalCost(vehicleId) = Σ FuelLog.cost + Σ MaintenanceLog.cost   (per spec 3.7)
   fuelEfficiency = totalDistance / totalLiters
   roi = (revenue - (maintenanceCost + fuelCost)) / acquisitionCost
```

**⚠️ Spec gap to resolve as a team before building this:** the doc lists a separate `Expenses` entity for tolls, but the "total operational cost" formula (3.7) and ROI formula (3.8) only mention Fuel + Maintenance — tolls/expenses aren't included in either formula as written. Also, **Revenue** isn't defined anywhere in the DB entities (3.6) despite being needed for the ROI formula. Decide together in hour 0: either (a) add a `revenuePerTrip` or `ratePerKm` field so Trip can generate revenue, or (b) add a flat `revenue` field on Vehicle you seed manually. Don't silently invent a number for the demo — pick one, document the assumption, and mention it if asked.

### Dashboard KPIs

```
dashboard.actions.ts:
   prisma.vehicle.groupBy({ by: ['status'], _count: true })   // Active/Available/In-Shop counts
   prisma.driver.groupBy({ by: ['status'], _count: true })    // On Duty count
   prisma.trip.groupBy({ by: ['status'], _count: true })      // Active/Pending trips
   fleetUtilization% = vehicles(status=ON_TRIP) / vehicles(status != RETIRED) * 100
```

Use `groupBy`/aggregate queries, not `findMany()` + JS loop — cheaper and it's the kind of detail that reads as "thought about scale" to a judge.

---

## 5. Bonus Features (Only If Core Is Done Early)

Don't touch any of these until every item in the Hour 6.5–7.5 integration step works and the pre-demo checklist below passes once. Ranked by **impression-per-minute** — do them top to bottom, stop whenever time runs out.

| Rank | Feature                                 | Effort      | Suggested Owner                           | Notes                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---- | --------------------------------------- | ----------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Dark mode                               | ~15 min     | Whoever built `components/ui/`            | `next-themes` + Tailwind `darkMode: 'class'`. One wrapper, applies everywhere instantly — cheapest points on the list.                                                                                                                                                                                                                                                                                                      |
| 2    | Charts on Dashboard/Reports             | ~45 min     | Person B (owns dashboard/reports already) | `recharts` — a bar chart for fleet utilization and a line chart for operational cost trend are enough; don't build more than 2.                                                                                                                                                                                                                                                                                             |
| 3    | Search, filters & sorting on list pages | ~45 min     | Person A (owns Vehicle/Driver lists)      | Note: filters _by vehicle type, status, region on the Dashboard_ are already core (spec 3.2) and should already exist from the main build — this bonus is extending search/sort to the Vehicle, Driver, and Trip list tables specifically.                                                                                                                                                                                  |
| 4    | PDF export                              | ~30–45 min  | Person B (owns reports)                   | CSV export is already mandatory (3.8) and covers the "export" requirement — only attempt PDF if CSV is solid and time remains. Use a lightweight client-side lib (e.g. jsPDF) rather than a server-side PDF pipeline given the time budget.                                                                                                                                                                                 |
| 5    | Vehicle document management             | ~45–60 min  | Person A                                  | Needs file upload + storage. For an 8-hour demo, skip cloud storage setup — store the file as base64 in a `documentUrl`/`documentData` field on Vehicle, or use a simple upload service if one's already in your toolkit. Lowest priority if storage isn't already configured.                                                                                                                                              |
| 6    | Email reminders for expiring licenses   | ~45–60 min+ | Either                                    | Hardest to do properly — a real reminder needs a scheduled job (cron/queue), which is disproportionate infra for an 8-hour build. **Pragmatic version:** a "Licenses Expiring Soon" widget on the Safety Officer dashboard (query `licenseExpiry` within next 30 days) demonstrates the same business value without needing actual email infrastructure. Only wire up real emails (e.g. Resend) if everything else is done. |

If you do get to these, keep committing to your own domain's files — dark mode and charts are the only two that touch shared/`ui` territory, so coordinate those two specifically before starting.

---

## 6. Pre-Demo Checklist (last 30 min)

- [ ] Run the exact Van-05 / Alex workflow from the problem statement start to finish
- [ ] Try to dispatch a suspended driver / expired license → confirm it's blocked
- [ ] Try to exceed cargo weight → confirm it's blocked
- [ ] Confirm a vehicle in maintenance never appears in the Trip creation dropdown
- [ ] Seed enough realistic data that the dashboard KPIs aren't all zero
- [ ] Both of you `git pull` on `main` and do one final joint smoke test
