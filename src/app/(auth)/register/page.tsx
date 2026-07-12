"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/actions/auth.actions";
import type { AuthFormState } from "@/validations/auth.schema";

const initialState: AuthFormState = {};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

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
          {state?.message && (
            <div className="mb-6 flex items-center gap-2 rounded-md border border-[#f87171]/30 bg-[#f87171]/10 px-4 py-3 text-sm text-[#fca5a5]">
              {state.message}
            </div>
          )}

          <div className="mb-10">
            <h2 className="text-[2rem] font-light tracking-tight mb-2 font-sans">
              Create your account
            </h2>
            <p className="text-[0.95rem] text-[#888888]">
              Join your fleet operations team
            </p>
          </div>

          <form action={formAction} className="space-y-5" noValidate>
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-name"
                className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#777777]"
              >
                Full Name
              </label>
              <input
                id="reg-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Alex Johnson"
                className={`w-full rounded-md border bg-[#1A1A1C] px-4 py-3.5 text-[0.95rem] text-white placeholder-[#555555] transition-colors focus:border-[#B38645] focus:outline-none focus:ring-1 focus:ring-[#B38645] ${state?.errors?.name ? "border-[#f87171]" : "border-[#333333]"
                  }`}
              />
              {state?.errors?.name && (
                <p className="text-xs text-[#f87171] mt-1">{state.errors.name[0]}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-email"
                className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#777777]"
              >
                Email
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className={`w-full rounded-md border bg-[#1A1A1C] px-4 py-3.5 text-[0.95rem] text-white placeholder-[#555555] transition-colors focus:border-[#B38645] focus:outline-none focus:ring-1 focus:ring-[#B38645] ${state?.errors?.email ? "border-[#f87171]" : "border-[#333333]"
                  }`}
              />
              {state?.errors?.email && (
                <p className="text-xs text-[#f87171] mt-1">{state.errors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-password"
                className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#777777]"
              >
                Password
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full rounded-md border bg-[#1A1A1C] px-4 py-3.5 text-[0.95rem] text-white placeholder-[#555555] transition-colors focus:border-[#B38645] focus:outline-none focus:ring-1 focus:ring-[#B38645] ${state?.errors?.password ? "border-[#f87171]" : "border-[#333333]"
                  }`}
              />
              {state?.errors?.password && (
                <p className="text-xs text-[#f87171] mt-1">{state.errors.password[0]}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-confirm"
                className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#777777]"
              >
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full rounded-md border bg-[#1A1A1C] px-4 py-3.5 text-[0.95rem] text-white placeholder-[#555555] transition-colors focus:border-[#B38645] focus:outline-none focus:ring-1 focus:ring-[#B38645] ${state?.errors?.confirmPassword ? "border-[#f87171]" : "border-[#333333]"
                  }`}
              />
              {state?.errors?.confirmPassword && (
                <p className="text-xs text-[#f87171] mt-1">{state.errors.confirmPassword[0]}</p>
              )}
            </div>

            {/* Role Dropdown */}
            <div className="space-y-1.5">
              <label
                htmlFor="reg-role"
                className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#777777]"
              >
                Role
              </label>
              <div className="relative">
                <select
                  id="reg-role"
                  name="role"
                  defaultValue="DISPATCHER"
                  className={`w-full appearance-none rounded-md border bg-[#1A1A1C] px-4 py-3.5 text-[0.95rem] text-[#CCCCCC] focus:border-[#B38645] focus:outline-none focus:ring-1 focus:ring-[#B38645] transition-colors ${state?.errors?.role ? "border-[#f87171]" : "border-[#333333]"
                    }`}
                >
                  <option value="FLEET_MANAGER">Fleet Manager</option>
                  <option value="DISPATCHER">Dispatcher</option>
                  <option value="SAFETY_OFFICER">Safety Officer</option>
                  <option value="FINANCIAL_ANALYST">Financial Analyst</option>
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
              {state?.errors?.role && (
                <p className="text-xs text-[#f87171] mt-1">{state.errors.role[0]}</p>
              )}
            </div>

            <button
              id="register-submit"
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-8">
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
