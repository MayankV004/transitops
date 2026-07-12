"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const role = formData.get("role") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsPending(false);
      return;
    }

    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      role,
    });

    if (error) {
      setError(error.message || "Registration failed. Please try again.");
      setIsPending(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left Section - Beige */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-[#D3D7D8] p-12 lg:p-16 relative text-[#1A1A1A]">
        <div>
          <div className="mb-4">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-4">
              <rect width="48" height="48" rx="8" fill="#B38645" />
              <path d="M12 12H36V36H12V12Z" stroke="#FFE9C5" strokeWidth="2" />
              <path d="M20 12V36" stroke="#FFE9C5" strokeWidth="2" />
              <path d="M28 12V36" stroke="#FFE9C5" strokeWidth="2" />
              <path d="M12 20H36" stroke="#FFE9C5" strokeWidth="2" />
              <path d="M12 28H36" stroke="#FFE9C5" strokeWidth="2" />
            </svg>
            <h1 className="text-6xl leading-tight font-bold tracking-tight mb-3 text-[#111111]">
              TransitOps
            </h1>
            <p className="text-2xl text-[#444444] font-medium">
              Smart Transport Operations Platform
            </p>
            
            <p className="mt-20 text-3xl text-black font-semibold leading-tight max-w-sm">
              Streamline your fleet, optimize your dispatching, and power your logistics from one unified dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Black */}
      <div className="flex w-full lg:w-[55%] items-center justify-center bg-[#0F0F11] p-8 text-white relative">
        <div className="w-full max-w-[420px]">
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-md border border-[#f87171]/30 bg-[#f87171]/10 px-4 py-3 text-sm text-[#fca5a5]">
              {error}
            </div>
          )}

          <div className="mb-10">
            <h2 className="text-[2rem] font-light tracking-tight mb-2 font-sans">
              Create your account
            </h2>
            <p className="text-[0.95rem] text-[#888888]">
              Join TransitOps to manage your fleet
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#777777]">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Raven K."
                className="w-full rounded-md border border-[#333333] bg-[#1A1A1C] px-4 py-3 text-[0.95rem] text-white placeholder-[#555555] focus:border-[#B38645] focus:outline-none focus:ring-1 focus:ring-[#B38645]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#777777]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="raven.k@transitops.in"
                className="w-full rounded-md border border-[#333333] bg-[#1A1A1C] px-4 py-3 text-[0.95rem] text-white placeholder-[#555555] focus:border-[#B38645] focus:outline-none focus:ring-1 focus:ring-[#B38645]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="role" className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#777777]">
                Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  defaultValue="DISPATCHER"
                  className="w-full appearance-none rounded-md border border-[#333333] bg-[#1A1A1C] px-4 py-3 text-[0.95rem] text-[#CCCCCC] focus:border-[#B38645] focus:outline-none focus:ring-1 focus:ring-[#B38645]"
                >
                  <option value="FLEET_MANAGER">Fleet Manager</option>
                  <option value="DISPATCHER">Dispatcher</option>
                  <option value="SAFETY_OFFICER">Safety Officer</option>
                  <option value="FINANCIAL_ANALYST">Financial Analyst</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#777777]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#777777]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full rounded-md border border-[#333333] bg-[#1A1A1C] px-4 py-3 text-[0.95rem] text-white placeholder-[#555555] focus:border-[#B38645] focus:outline-none focus:ring-1 focus:ring-[#B38645]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#777777]">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full rounded-md border border-[#333333] bg-[#1A1A1C] px-4 py-3 text-[0.95rem] text-white placeholder-[#555555] focus:border-[#B38645] focus:outline-none focus:ring-1 focus:ring-[#B38645]"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-8 w-full rounded-md bg-[#A05C00] py-3 text-[0.95rem] font-medium text-white hover:bg-[#8A5000] focus:outline-none focus:ring-2 focus:ring-[#A05C00] transition-colors disabled:opacity-70 flex justify-center items-center"
            >
              {isPending ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-[#222222]">
            <p className="text-[0.9rem] text-[#888888]">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[#4B7399] hover:text-[#5E8DBA] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F11]" />}>
      <RegisterForm />
    </Suspense>
  );
}
