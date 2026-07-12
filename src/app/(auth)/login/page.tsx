"use client";

import React, { useActionState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth.actions";
import type { AuthFormState } from "@/validations/auth.schema";
import { useAuth } from "@/hooks/use-auth";

const initialState: AuthFormState = {};

function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isPending: sessionLoading } = useAuth();
  const registered = searchParams.get("registered") === "true";

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!sessionLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, sessionLoading, router]);

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left Section - Beige */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-[#D3D7D8] p-12 lg:p-16 relative text-[#1A1A1A]">
        <div>
          <div className="mb-4">
            {/* Logo */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-4"
            >
              <rect width="48" height="48" rx="8" fill="#B38645" />
              {/* Simple grid pattern for logo as in image */}
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
          {/* Alerts */}
          {registered && (
            <div className="mb-6 flex items-center gap-2 rounded-md border border-[#10b981]/30 bg-[#10b981]/10 px-4 py-3 text-sm text-[#6ee7b7]">
              Account created! Please sign in.
            </div>
          )}
          {state?.message && (
            <div className="mb-6 flex items-center gap-2 rounded-md border border-[#f87171]/30 bg-[#f87171]/10 px-4 py-3 text-sm text-[#fca5a5]">
              {state.message}
            </div>
          )}

          <div className="mb-10">
            <h2 className="text-[2rem] font-light tracking-tight mb-2 font-sans">
              Sign in to your account
            </h2>
            <p className="text-[0.95rem] text-[#888888]">
              Enter your credentials to continue
            </p>
          </div>

          <form action={formAction} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#777777]"
              >
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Raven.k@transitops.in"
                className={`w-full rounded-md border bg-[#1A1A1C] px-4 py-3.5 text-[0.95rem] text-white placeholder-[#555555] transition-colors focus:border-[#B38645] focus:outline-none focus:ring-1 focus:ring-[#B38645] ${state?.errors?.email ? "border-[#f87171]" : "border-[#333333]"
                  }`}
                aria-describedby={state?.errors?.email ? "email-error" : undefined}
              />
              {state?.errors?.email && (
                <p id="email-error" className="text-xs text-[#f87171] mt-1">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#777777]"
              >
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={`w-full rounded-md border bg-[#1A1A1C] px-4 py-3.5 text-[0.95rem] text-white placeholder-[#555555] transition-colors focus:border-[#B38645] focus:outline-none focus:ring-1 focus:ring-[#B38645] ${state?.errors?.password ? "border-[#f87171]" : "border-[#333333]"
                  }`}
                aria-describedby={state?.errors?.password ? "password-error" : undefined}
              />
              {state?.errors?.password && (
                <p id="password-error" className="text-xs text-[#f87171] mt-1">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="role"
                className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#777777]"
              >
                Role (RBAC)
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  defaultValue="Dispatcher"
                  className="w-full appearance-none rounded-md border border-[#333333] bg-[#1A1A1C] px-4 py-3.5 text-[0.95rem] text-[#CCCCCC] focus:border-[#B38645] focus:outline-none focus:ring-1 focus:ring-[#B38645] transition-colors"
                >
                  <option value="Fleet Manager">Fleet Manager</option>
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Safety Officer">Safety Officer</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#777777]">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4 border border-[#555555] rounded bg-[#1A1A1C] group-hover:border-[#777777] transition-colors">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <svg
                    className="h-3 w-3 text-[#B38645] opacity-0 peer-checked:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-[#CCCCCC]">Remember me</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#4B7399] hover:text-[#5E8DBA] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isPending}
              className="mt-6 w-full rounded-md bg-[#A05C00] py-3.5 text-[0.95rem] font-medium text-white hover:bg-[#8A5000] focus:outline-none focus:ring-2 focus:ring-[#A05C00] focus:ring-offset-2 focus:ring-offset-[#0F0F11] transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              aria-busy={isPending}
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F11]" />}>
      <LoginForm />
    </Suspense>
  );
}
