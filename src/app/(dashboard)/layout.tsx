import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { canAccess, ROLE_LABELS, ROLE_COLORS } from "@/lib/rbac-client";
import type { Role } from "@/generated/prisma/client";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/LogoutButton";

// Nav items ordered by importance
const NAV_ITEMS = [
  {
    resource: "dashboard",
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1.5" y="10.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10.5" y="10.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    resource: "vehicles",
    href: "/vehicles",
    label: "Vehicles",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 11V8L4.5 4H13.5L16 8V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="1.5" y="10.5" width="15" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="5" cy="14" r="1.25" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="13" cy="14" r="1.25" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    ),
  },
  {
    resource: "drivers",
    href: "/drivers",
    label: "Drivers",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2.5 16c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    resource: "trips",
    href: "/trips",
    label: "Trips",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    resource: "maintenance",
    href: "/maintenance",
    label: "Maintenance",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M14.5 3.5L11 7l1 1 3.5-3.5a2.5 2.5 0 0 0-3.5-3.5L8.5 4.5l1 1 3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M3 15l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 8l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    resource: "fuel-expenses",
    href: "/fuel-expenses",
    label: "Fuel & Expenses",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 15V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 7h2a1 1 0 0 1 1 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M7 7h2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <path d="M7 10h2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    resource: "reports",
    href: "/reports",
    label: "Reports",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2.5" y="2.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 9h6M6 12h4M6 6h3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  // Belt-and-suspenders: middleware handles this but we double-check in layout
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as { id: string; name: string; email: string; role?: string };
  const role = (user.role ?? "DISPATCHER") as Role;
  const roleLabel = ROLE_LABELS[role] ?? role;
  const roleColor = ROLE_COLORS[role] ?? "#6366f1";

  const visibleNav = NAV_ITEMS.filter((item) => canAccess(role, item.resource));

  return (
    <div className="shell">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#6366f1" />
              <path d="M6 14h4M18 14h4M10 14a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 6v4M14 18v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="sidebar-brand-name">TransitOps</span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav" aria-label="Main navigation">
          {visibleNav.map((item) => (
            <Link key={item.resource} href={item.href} className="nav-item" id={`nav-${item.resource}`}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User card */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">
              {user.name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <div className="user-info">
              <p className="user-name">{user.name}</p>
              <span className="user-role-badge" style={{ color: roleColor, borderColor: roleColor }}>
                {roleLabel}
              </span>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="shell-main">
        {children}
      </main>

      <style>{`
        .shell {
          display: flex;
          min-height: 100vh;
          background: #070711;
          font-family: 'Inter', 'Geist', system-ui, sans-serif;
        }

        /* --- Sidebar --- */
        .sidebar {
          width: 240px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          background: rgba(10, 10, 25, 0.95);
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          padding: 1.25rem 0.75rem;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          gap: 0;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.25rem 0.5rem 1.5rem;
        }
        .sidebar-logo { display: flex; align-items: center; }
        .sidebar-brand-name {
          font-size: 1rem;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.02em;
        }

        /* --- Nav --- */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.5625rem 0.75rem;
          border-radius: 0.5rem;
          color: #64748b;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background 0.15s, color 0.15s;
        }
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #cbd5e1;
        }
        .nav-item.active,
        .nav-item[aria-current="page"] {
          background: rgba(99, 102, 241, 0.12);
          color: #a5b4fc;
        }
        .nav-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .nav-label { line-height: 1; }

        /* --- Sidebar footer / user card --- */
        .sidebar-footer {
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: auto;
        }
        .user-card {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          flex: 1;
          min-width: 0;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8125rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
        .user-info {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
        }
        .user-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #cbd5e1;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-role-badge {
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border: 1px solid;
          border-radius: 999px;
          padding: 0.1rem 0.4rem;
          opacity: 0.85;
          white-space: nowrap;
        }

        .sign-out-btn {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.375rem;
          color: #475569;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .sign-out-btn:hover {
          background: rgba(248, 113, 113, 0.1);
          color: #f87171;
          border-color: rgba(248, 113, 113, 0.2);
        }

        /* --- Main content --- */
        .shell-main {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          color: #f1f5f9;
        }
      `}</style>
    </div>
  );
}
