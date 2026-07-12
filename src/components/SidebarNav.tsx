"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  resource: string;
  href: string;
  label: string;
  icon: ReactNode;
};

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="sidebar-nav" aria-label="Main navigation">
      {items.map((item) => {
        // Dashboard is a special case (exact match), otherwise check if it starts with the href
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.resource}
            href={item.href}
            className={`nav-item ${isActive ? "active" : ""}`}
            id={`nav-${item.resource}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
