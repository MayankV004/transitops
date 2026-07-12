"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/hooks/use-auth";

function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message || "Invalid credentials. Please try again.");
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
          {registered && (
            <div className="mb-6 flex items-center gap-2 rounded-md border border-[#10b981]/30 bg-[#10b981]/10 px-4 py-3 text-sm text-[#6ee7b7]">
              Account created! Please sign in.
            </div>
          )}
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-md border border-[#f87171]/30 bg-[#f87171]/10 px-4 py-3 text-sm text-[#fca5a5]">
              {error}
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

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#777777]">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Raven.k@transitops.in"
                className="w-full rounded-md border border-[#333333] bg-[#1A1A1C] px-4 py-3.5 text-[0.95rem] text-white placeholder-[#555555] transition-colors focus:border-[#B38645] focus:outline-none focus:ring-1 focus:ring-[#B38645]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-[0.7rem] font-semibold uppercase tracking-widest text-[#777777]">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-md border border-[#333333] bg-[#1A1A1C] px-4 py-3.5 text-[0.95rem] text-white placeholder-[#555555] transition-colors focus:border-[#B38645] focus:outline-none focus:ring-1 focus:ring-[#B38645]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4 border border-[#555555] rounded bg-[#1A1A1C] group-hover:border-[#777777] transition-colors">
                  <input type="checkbox" className="peer sr-only" defaultChecked />
                  <svg className="h-3 w-3 text-[#B38645] opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-[#CCCCCC]">Remember me</span>
              </label>

              <Link href="/forgot-password" className="text-sm font-medium text-[#4B7399] hover:text-[#5E8DBA] transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-6 w-full rounded-md bg-[#A05C00] py-3.5 text-[0.95rem] font-medium text-white hover:bg-[#8A5000] focus:outline-none focus:ring-2 focus:ring-[#A05C00] transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isPending ? "Signing In..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-8 text-center pt-8">
            <p className="text-[0.9rem] text-[#888888]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-[#4B7399] hover:text-[#5E8DBA] transition-colors">
                Register
              </Link>
            </p>
          </div>
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
