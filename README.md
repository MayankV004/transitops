<div align="center">
  <div style="background: linear-gradient(135deg, #b48a58 0%, #8a6538 100%); padding: 16px; border-radius: 16px; display: inline-block; margin-bottom: 20px;">
    <svg width="48" height="48" viewBox="0 0 28 28" fill="none">
      <path d="M6 14h4M18 14h4M10 14a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 6v4M14 18v4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  </div>
  
  # TransitOps 
  
  **Intelligent Logistics & Fleet Operations Platform**

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Better Auth](https://img.shields.io/badge/Better_Auth-Security-000000)](https://better-auth.com/)
</div>

<br />

TransitOps is an enterprise-grade web application built to streamline logistics, dispatching, and fleet management for modern transit agencies. It ensures airtight operational integrity through strict business rules, Role-Based Access Control (RBAC), and transactional data mutations.

---

## ✨ Key Features

### 🚛 **Fleet Registry & Status Locking**
Track every vehicle's details, including acquisition cost, cargo capacity, current odometer, and operational status (`AVAILABLE`, `ON_TRIP`, `IN_SHOP`, `RETIRED`).
- **Automated Lifecycle:** Assigning a vehicle to a trip automatically updates its status to `ON_TRIP`. Logging maintenance locks it to `IN_SHOP`. 

### 👥 **Driver Management & Safety**
Manage driver profiles, license numbers, current statuses, and safety scores.
- **Dispatch Integrity:** Drivers can only be assigned to trips if they are marked `AVAILABLE`. Attempting to double-book a driver throws a validation error.

### 🗺️ **Intelligent Trip Dispatching**
Create, dispatch, and complete trips natively inside the platform.
- **Atomic Transactions:** Trips use `$transaction` blocks to ensure the Vehicle and Driver states are mutated safely at the exact moment a trip is dispatched.
- **Post-Trip Workflows:** Completing a trip automatically logs the actual distance traveled into the vehicle's total odometer.

### 🛠️ **Maintenance, Fuel & Expenses**
A comprehensive ledger for the physical costs of running a fleet.
- Track fuel logs (liters, cost, date) mapped securely to individual vehicles.
- Log operational expenses (tolls, parking, repairs) to calculate total asset burn rate.

### 📈 **Analytics & PDF Reporting**
The dashboard aggregates all operational data into top-level KPIs.
- Real-time fleet utilization percentage, total operational costs, fuel efficiency, and individual vehicle ROI.
- **Export to PDF:** Instantly generate clean PDF reports of the current dashboard using `jsPDF` and `jspdf-autotable`.

### 🛡️ **Role-Based Access Control (RBAC)**
Secure down to the action layer. Middleware protects routes, and Server Actions enforce permissions via `requireRole()`.
- **Fleet Manager:** Full administrative access (can update global Depot settings).
- **Dispatcher:** Manages Vehicles, Drivers, and Trips.
- **Safety Officer:** Manages Drivers and Maintenance Logs.
- **Financial Analyst:** Manages Fuel, Expenses, and views Analytics.

---

## 🏗️ Architecture & Tech Stack

TransitOps is built on a modern, fully-typed React stack prioritizing server-side rendering and mutation safety.

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) using Turbopack for compilation.
- **Language:** Strict [TypeScript](https://www.typescriptlang.org/).
- **Database ORM:** [Prisma](https://www.prisma.io/) connected to a PostgreSQL database (Neon).
- **Authentication:** [Better Auth](https://better-auth.com/) for session management, API proxying, and role assignment.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with a custom glassmorphism design system.
- **Icons:** [Lucide React](https://lucide.dev/).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- A PostgreSQL Database (e.g., [Neon](https://neon.tech/), Supabase, or local Postgres)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MayankV004/transitops.git
   cd transitops
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   BETTER_AUTH_SECRET="generate-a-strong-secret-here"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

4. **Initialize the Database**
   Push the Prisma schema to your database:
   ```bash
   npx prisma db push
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The platform will be available at `http://localhost:3000`.

---

## 📂 Project Structure

```text
src/
├── actions/             # Server Actions (Mutations & DB fetching)
├── app/                 # Next.js App Router (Pages & Layouts)
│   ├── (auth)/          # Login & Registration routes
│   └── (dashboard)/     # Protected fleet management routes
├── components/          # Reusable React UI components
├── generated/           # Prisma client generation
├── lib/                 # Utilities (Prisma init, RBAC logic, Auth instance)
└── validations/         # Zod schemas for form & API validation
```

---

## 🔒 Security Posture

- **Middleware Proxy:** `src/proxy.ts` intercepts all requests to `/dashboard/*`, `/vehicles/*`, etc. If no valid session is found, it redirects to `/login`.
- **Server Action Guards:** Functions inside `src/actions/` utilize `getSessionOrRedirect()` and `requireRole(["ROLE_NAME"])` before performing database queries.
- **UI Conditionally Rendered:** The `ROLE_PERMISSIONS` map in `src/lib/rbac-client.ts` is used by the frontend to hide/show buttons based on the user's role.

---

## 🎨 Design System

TransitOps utilizes a minimal, dark-mode-first aesthetic:
- **Colors:** Deep blacks (`#000`), subtle surfaces (`#09090b`), and a signature brand gold/primary (`#b48a58`).
- **Typography:** `Inter` for clean data tables and `Geist` for sharp headings.
- **Instant Loading:** Every dashboard route contains a custom `loading.tsx` skeleton for optimal Perceived Load Time.

---

<div align="center">
  <p>Built with ❤️ for modern transit operations.</p>
</div>
