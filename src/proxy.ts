import { NextRequest, NextResponse } from "next/server";


// Routes that require authentication (dashboard and all sub-routes)
const PROTECTED_PATHS = [
  "/dashboard",
  "/vehicles",
  "/drivers",
  "/trips",
  "/maintenance",
  "/fuel-expenses",
  "/reports",
];

// Routes only accessible to unauthenticated users (redirect logged-in users away)
const AUTH_PATHS = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (!isProtected && !isAuthPath) {
    return NextResponse.next();
  }

  let session = null;
  try {
    const res = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });
    if (res.ok) {
      session = await res.json();
    }
  } catch (err) {
    console.error("PROXY ERROR:", err);
  }

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !session?.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/register
  if (isAuthPath && session?.user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
