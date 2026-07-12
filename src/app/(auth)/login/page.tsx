"use client";

import { useActionState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth.actions";
import type { AuthFormState } from "@/validations/auth.schema";
import { useAuth } from "@/hooks/use-auth";

const initialState: AuthFormState = {};

// Inner component that uses useSearchParams — must be wrapped in Suspense
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
    <>
      {/* Success banner after register */}
      {registered && (
        <div className="login-alert login-alert-success" role="alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Account created! Please sign in.
        </div>
      )}

      {/* Error banner */}
      {state?.message && (
        <div className="login-alert login-alert-error" role="alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 5v4M8 11.5h.01" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="8" r="6.5" stroke="#f87171" strokeWidth="1.5" />
          </svg>
          {state.message}
        </div>
      )}

      <form action={formAction} className="login-form" noValidate>
        {/* Email */}
        <div className="form-group">
          <label htmlFor="login-email" className="form-label">
            Email address
          </label>
          <div className="input-wrapper">
            <svg className="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
              <path d="M1.5 5.5L8 9.5L14.5 5.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className={`form-input ${state?.errors?.email ? "form-input-error" : ""}`}
              aria-describedby={state?.errors?.email ? "email-error" : undefined}
            />
          </div>
          {state?.errors?.email && (
            <p id="email-error" className="form-error">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <Link href="/forgot-password" className="form-link-sm">
              Forgot password?
            </Link>
          </div>
          <div className="input-wrapper">
            <svg className="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="3.5" y="7" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
              <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={`form-input ${state?.errors?.password ? "form-input-error" : ""}`}
              aria-describedby={state?.errors?.password ? "password-error" : undefined}
            />
          </div>
          {state?.errors?.password && (
            <p id="password-error" className="form-error">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          disabled={isPending}
          className="btn-primary"
          aria-busy={isPending}
        >
          {isPending ? (
            <>
              <span className="btn-spinner" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="login-footer">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="form-link">
          Create account
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="login-root">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
      </div>

      <div className="login-card-wrapper">
        {/* Logo / brand */}
        <div className="login-brand">
          <div className="login-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#6366f1" />
              <path d="M6 14h4M18 14h4M10 14a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 6v4M14 18v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="login-brand-name">TransitOps</span>
        </div>

        {/* Card */}
        <div className="login-card">
          <div className="login-card-header">
            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Sign in to your operations dashboard</p>
          </div>

          {/* Wrap the form (uses useSearchParams) in Suspense */}
          <Suspense fallback={<div className="form-skeleton" />}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Role legend */}
        <div className="role-legend">
          <p className="role-legend-title">Role-based access control</p>
          <div className="role-badges">
            {[
              { label: "Fleet Manager", color: "#6366f1" },
              { label: "Dispatcher", color: "#0ea5e9" },
              { label: "Safety Officer", color: "#f59e0b" },
              { label: "Financial Analyst", color: "#10b981" },
            ].map((r) => (
              <span key={r.label} className="role-badge" style={{ borderColor: r.color, color: r.color }}>
                {r.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #070711;
          position: relative;
          overflow: hidden;
          padding: 2rem 1rem;
          font-family: 'Inter', 'Geist', system-ui, sans-serif;
        }

        /* --- Animated background orbs --- */
        .login-bg { position: absolute; inset: 0; pointer-events: none; }
        .login-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.18;
          animation: orb-drift 12s ease-in-out infinite alternate;
        }
        .login-orb-1 { width: 500px; height: 500px; background: #6366f1; top: -120px; left: -100px; animation-delay: 0s; }
        .login-orb-2 { width: 400px; height: 400px; background: #0ea5e9; bottom: -80px; right: -60px; animation-delay: -4s; }
        .login-orb-3 { width: 300px; height: 300px; background: #10b981; top: 50%; left: 50%; transform: translate(-50%,-50%); animation-delay: -8s; }
        @keyframes orb-drift {
          from { transform: translate(0,0) scale(1); }
          to { transform: translate(30px,20px) scale(1.08); }
        }
        .login-orb-3 { animation-name: orb-center-drift; }
        @keyframes orb-center-drift {
          from { transform: translate(-50%,-50%) scale(1); }
          to { transform: translate(calc(-50% + 20px), calc(-50% - 20px)) scale(1.1); }
        }

        /* --- Card wrapper --- */
        .login-card-wrapper {
          position: relative; z-index: 10;
          width: 100%; max-width: 420px;
          display: flex; flex-direction: column;
          align-items: center; gap: 1.5rem;
        }

        /* --- Brand --- */
        .login-brand { display: flex; align-items: center; gap: 0.625rem; }
        .login-logo { display: flex; align-items: center; }
        .login-brand-name { font-size: 1.25rem; font-weight: 700; color: #f1f5f9; letter-spacing: -0.02em; }

        /* --- Card --- */
        .login-card {
          width: 100%;
          background: rgba(15, 15, 30, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.25rem;
          padding: 2rem 2rem 1.75rem;
          backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(99, 102, 241, 0.1),
            0 24px 48px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }
        .login-card-header { margin-bottom: 1.5rem; }
        .login-title { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; letter-spacing: -0.03em; margin: 0 0 0.375rem; }
        .login-subtitle { font-size: 0.875rem; color: #64748b; margin: 0; }

        /* Suspense skeleton */
        .form-skeleton { height: 240px; border-radius: 0.625rem; background: rgba(255,255,255,0.03); }

        /* --- Alerts --- */
        .login-alert {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1rem; border-radius: 0.625rem;
          font-size: 0.8125rem; font-weight: 500;
          margin-bottom: 1.25rem;
        }
        .login-alert-success { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); color: #6ee7b7; }
        .login-alert-error { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); color: #fca5a5; }

        /* --- Form --- */
        .login-form { display: flex; flex-direction: column; gap: 1.125rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
        .form-label { font-size: 0.8125rem; font-weight: 500; color: #94a3b8; }
        .form-label-row { display: flex; align-items: center; justify-content: space-between; }
        .form-link-sm { font-size: 0.75rem; color: #6366f1; text-decoration: none; transition: color 0.15s; }
        .form-link-sm:hover { color: #818cf8; }

        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 0.875rem; color: #475569; pointer-events: none; flex-shrink: 0; }
        .form-input {
          width: 100%;
          padding: 0.6875rem 0.875rem 0.6875rem 2.5rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.625rem;
          color: #f1f5f9; font-size: 0.9375rem;
          outline: none; box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .form-input::placeholder { color: #334155; }
        .form-input:focus { border-color: #6366f1; background: rgba(99,102,241,0.05); box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .form-input-error { border-color: rgba(248,113,113,0.5) !important; }
        .form-input-error:focus { border-color: #f87171 !important; box-shadow: 0 0 0 3px rgba(248,113,113,0.15) !important; }
        .form-error { font-size: 0.75rem; color: #f87171; margin: 0; }

        /* --- Button --- */
        .btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          width: 100%; padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none; border-radius: 0.625rem;
          color: #fff; font-size: 0.9375rem; font-weight: 600;
          cursor: pointer; letter-spacing: -0.01em;
          box-shadow: 0 4px 15px rgba(99,102,241,0.35);
          transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
          margin-top: 0.375rem;
        }
        .btn-primary:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.45); }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.6s linear infinite;
          display: inline-block; flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* --- Footer --- */
        .login-footer { margin: 1.25rem 0 0; text-align: center; font-size: 0.8125rem; color: #475569; }
        .form-link { color: #6366f1; text-decoration: none; font-weight: 500; transition: color 0.15s; }
        .form-link:hover { color: #818cf8; }

        /* --- Role legend --- */
        .role-legend { text-align: center; }
        .role-legend-title { font-size: 0.6875rem; font-weight: 500; color: #334155; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 0.625rem; }
        .role-badges { display: flex; flex-wrap: wrap; gap: 0.375rem; justify-content: center; }
        .role-badge { font-size: 0.6875rem; font-weight: 500; padding: 0.25rem 0.625rem; border-radius: 999px; border: 1px solid; background: transparent; letter-spacing: 0.01em; opacity: 0.75; }
      `}</style>
    </div>
  );
}
