"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { loginSchema, registerSchema, type AuthFormState } from "@/validations/auth.schema";

// ---------------------------------------------------------------------------
// loginAction — called via form action={loginAction}
// Validates with Zod, signs in with better-auth, redirects on success.
// ---------------------------------------------------------------------------
export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // 1. Validate
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // 2. Sign in via better-auth server API
  try {
    const result = await auth.api.signInEmail({
      body: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
      headers: await headers(),
      asResponse: false,
    });

    if (!result?.user) {
      return {
        message: "Invalid email or password. Please try again.",
      };
    }
  } catch {
    return {
      message: "Invalid email or password. Please try again.",
    };
  }

  // 3. Redirect outside try/catch (Next.js redirect throws internally)
  redirect("/dashboard");
}

// ---------------------------------------------------------------------------
// registerAction — called via form action={registerAction}
// ---------------------------------------------------------------------------
export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    role: formData.get("role") as string,
  };

  // 1. Validate
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // 2. Register via better-auth
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        role: parsed.data.role, // Pass role to better-auth
      },
      headers: await headers(),
      asResponse: false,
    });

    if (!result?.user) {
      return {
        message: "Registration failed. This email may already be in use.",
      };
    }
  } catch {
    return {
      message: "An account with this email already exists. Please sign in.",
    };
  }

  // 3. Redirect to login after successful registration
  redirect("/login?registered=true");
}
