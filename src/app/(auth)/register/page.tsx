"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/actions/auth.actions";
import type { AuthFormState } from "@/validations/auth.schema";

const initialState: AuthFormState = {};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <div className="register-root">
      {/* Animated background */}
      <div className="register-bg">
        <div className="reg-orb reg-orb-1" />
        <div className="reg-orb reg-orb-2" />
        <div className="reg-orb reg-orb-3" />
      </div>

      <div className="register-wrapper">
        {/* Brand */}
        <div className="reg-brand">
          <div className="reg-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#6366f1" />
              <path d="M6 14h4M18 14h4M10 14a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 6v4M14 18v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="reg-brand-name">TransitOps</span>
        </div>

        <div className="register-card">
          <div className="reg-card-header">
            <h1 className="reg-title">Create account</h1>
            <p className="reg-subtitle">Join your fleet operations team</p>
          </div>

          {/* Role notice */}
          <div className="reg-notice">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="#6366f1" strokeWidth="1.25" />
              <path d="M7 6v4M7 4.5h.01" stroke="#6366f1" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
            New accounts start as <strong>Dispatcher</strong>. A Fleet Manager can update your role.
          </div>

          {/* Server error */}
          {state?.message && (
            <div className="reg-alert reg-alert-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 5v4M8 11.5h.01" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="8" r="6.5" stroke="#f87171" strokeWidth="1.5" />
              </svg>
              {state.message}
            </div>
          )}

          <form action={formAction} className="reg-form" noValidate>
            {/* Name */}
            <div className="form-group">
              <label htmlFor="reg-name" className="form-label">Full name</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.25" />
                  <path d="M2.5 13.5C2.5 11 5 9 8 9s5.5 2 5.5 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                </svg>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Alex Johnson"
                  className={`form-input ${state?.errors?.name ? "form-input-error" : ""}`}
                />
              </div>
              {state?.errors?.name && <p className="form-error">{state.errors.name[0]}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="reg-email" className="form-label">Email address</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
                  <path d="M1.5 5.5L8 9.5L14.5 5.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                </svg>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className={`form-input ${state?.errors?.email ? "form-input-error" : ""}`}
                />
              </div>
              {state?.errors?.email && <p className="form-error">{state.errors.email[0]}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3.5" y="7" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
                  <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                </svg>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Min. 8 chars, 1 number, 1 uppercase"
                  className={`form-input ${state?.errors?.password ? "form-input-error" : ""}`}
                />
              </div>
              {state?.errors?.password && <p className="form-error">{state.errors.password[0]}</p>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="reg-confirm" className="form-label">Confirm password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3.5" y="7" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
                  <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  <path d="M6.5 10.5L7.5 11.5L9.5 9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  id="reg-confirm"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={`form-input ${state?.errors?.confirmPassword ? "form-input-error" : ""}`}
                />
              </div>
              {state?.errors?.confirmPassword && <p className="form-error">{state.errors.confirmPassword[0]}</p>}
            </div>

            {/* Role Dropdown */}
            <div className="form-group">
              <label htmlFor="reg-role" className="form-label">Role</label>
              <div className="input-wrapper select-wrapper">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4.5 6L8 9.5L11.5 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <select
                  id="reg-role"
                  name="role"
                  className={`form-input form-select ${state?.errors?.role ? "form-input-error" : ""}`}
                  defaultValue="DISPATCHER"
                >
                  <option value="FLEET_MANAGER">Fleet Manager</option>
                  <option value="DISPATCHER">Dispatcher</option>
                  <option value="SAFETY_OFFICER">Safety Officer</option>
                  <option value="FINANCIAL_ANALYST">Financial Analyst</option>
                </select>
              </div>
              {state?.errors?.role && <p className="form-error">{state.errors.role[0]}</p>}
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={isPending}
              className="btn-primary"
              aria-busy={isPending}
            >
              {isPending ? (
                <>
                  <span className="btn-spinner" aria-hidden="true" />
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="reg-footer">
            Already have an account?{" "}
            <Link href="/login" className="form-link">Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        .register-root {
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
        .register-bg { position: absolute; inset: 0; pointer-events: none; }
        .reg-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); opacity: 0.15;
          animation: orb-float 14s ease-in-out infinite alternate;
        }
        .reg-orb-1 { width: 450px; height: 450px; background: #8b5cf6; top: -100px; right: -80px; animation-delay: 0s; }
        .reg-orb-2 { width: 350px; height: 350px; background: #0ea5e9; bottom: -60px; left: -60px; animation-delay: -5s; }
        .reg-orb-3 { width: 250px; height: 250px; background: #f59e0b; top: 60%; right: 20%; animation-delay: -10s; }
        @keyframes orb-float {
          from { transform: translate(0,0) scale(1); }
          to { transform: translate(20px, 25px) scale(1.06); }
        }

        .register-wrapper {
          position: relative; z-index: 10;
          width: 100%; max-width: 420px;
          display: flex; flex-direction: column;
          align-items: center; gap: 1.5rem;
        }
        .reg-brand { display: flex; align-items: center; gap: 0.625rem; }
        .reg-logo { display: flex; align-items: center; }
        .reg-brand-name { font-size: 1.25rem; font-weight: 700; color: #f1f5f9; letter-spacing: -0.02em; }

        .register-card {
          width: 100%;
          background: rgba(15, 15, 30, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.25rem;
          padding: 2rem 2rem 1.75rem;
          backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(139, 92, 246, 0.1),
            0 24px 48px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .reg-card-header { margin-bottom: 1.25rem; }
        .reg-title { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; letter-spacing: -0.03em; margin: 0 0 0.375rem; }
        .reg-subtitle { font-size: 0.875rem; color: #64748b; margin: 0; }

        .reg-notice {
          display: flex; align-items: flex-start; gap: 0.5rem;
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 0.625rem;
          padding: 0.625rem 0.875rem;
          font-size: 0.8125rem; color: #94a3b8;
          margin-bottom: 1.25rem; line-height: 1.4;
        }
        .reg-notice svg { flex-shrink: 0; margin-top: 1px; }
        .reg-notice strong { color: #a5b4fc; }

        .reg-alert {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1rem; border-radius: 0.625rem;
          font-size: 0.8125rem; font-weight: 500;
          margin-bottom: 1.25rem;
        }
        .reg-alert-error {
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.25);
          color: #fca5a5;
        }

        .reg-form { display: flex; flex-direction: column; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
        .form-label { font-size: 0.8125rem; font-weight: 500; color: #94a3b8; }

        .input-wrapper { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 0.875rem; color: #475569; pointer-events: none; flex-shrink: 0; }
        .form-input {
          width: 100%;
          padding: 0.6875rem 0.875rem 0.6875rem 2.5rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.625rem;
          color: #f1f5f9; font-size: 0.9375rem;
          outline: none; box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .form-input::placeholder { color: #334155; }
        .form-input:focus {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.05);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
        }
        .form-input-error { border-color: rgba(248, 113, 113, 0.5) !important; }
        .form-input-error:focus { border-color: #f87171 !important; box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.15) !important; }
        .form-error { font-size: 0.75rem; color: #f87171; margin: 0; }

        .form-select {
          appearance: none;
          padding-left: 2.5rem;
          cursor: pointer;
        }
        .form-select option {
          background: #0f0f1e;
          color: #f1f5f9;
        }

        .btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          width: 100%; padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          border: none; border-radius: 0.625rem;
          color: #fff; font-size: 0.9375rem; font-weight: 600;
          cursor: pointer; letter-spacing: -0.01em;
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.35);
          transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
          margin-top: 0.375rem;
        }
        .btn-primary:hover:not(:disabled) {
          opacity: 0.92; transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.45);
        }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block; flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .reg-footer { margin: 1.25rem 0 0; text-align: center; font-size: 0.8125rem; color: #475569; }
        .form-link { color: #8b5cf6; text-decoration: none; font-weight: 500; transition: color 0.15s; }
        .form-link:hover { color: #a78bfa; }
      `}</style>
    </div>
  );
}
