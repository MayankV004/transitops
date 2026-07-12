"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export function VehicleFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState(searchParams.get("type") || "All");
  const [status, setStatus] = useState(searchParams.get("status") || "All");
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="filters-bar">
      <div className="filter-group">
        <label>Type:</label>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            updateFilters("type", e.target.value);
          }}
        >
          <option value="All">All</option>
          <option value="Van">Van</option>
          <option value="Truck">Truck</option>
          <option value="Mini">Mini</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Status:</label>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            updateFilters("status", e.target.value);
          }}
        >
          <option value="All">All</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="IN_SHOP">In Shop</option>
          <option value="RETIRED">Retired</option>
        </select>
      </div>

      <div className="filter-group search-group">
        <input
          type="text"
          placeholder="Search reg. no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateFilters("search", search);
          }}
          onBlur={() => updateFilters("search", search)}
        />
      </div>

      <style>{`
        .filters-bar {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 0.5rem;
        }
        .filter-group label {
          font-size: 0.875rem;
          color: #94a3b8;
        }
        .filter-group select, .filter-group input {
          background: transparent;
          border: none;
          color: #f1f5f9;
          font-size: 0.875rem;
          outline: none;
        }
        .filter-group select option {
          background: #09090b;
          color: #f1f5f9;
        }
      `}</style>
    </div>
  );
}
