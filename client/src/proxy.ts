import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication (any logged-in user)
const PROTECTED_ROUTES = ["/bookings", "/profile"];

// Routes that require a specific role
const ROLE_ROUTES: Record<string, string> = {
  "/provider": "PROVIDER",
  "/admin": "ADMIN",
};

// Routes only for guests (redirect logged-in users away)
const GUEST_ONLY_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read auth token and user from cookies (set by the client after login)
  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user")?.value;

  let userRole: string | null = null;
  if (userCookie) {
    try {
      const user = JSON.parse(decodeURIComponent(userCookie));
      userRole = user?.role ?? null;
    } catch {
      userRole = null;
    }
  }

  const isLoggedIn = Boolean(token && userRole);

  // Redirect logged-in users away from guest-only pages
  if (isLoggedIn && GUEST_ONLY_ROUTES.some((r) => pathname.startsWith(r))) {
    const redirectTo =
      userRole === "PROVIDER"
        ? "/provider"
        : userRole === "ADMIN"
          ? "/admin"
          : "/services";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Protect authenticated-only routes
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect role-specific routes
  for (const [route, requiredRole] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!isLoggedIn) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
      if (userRole !== requiredRole) {
        // Wrong role — send to their home
        const home =
          userRole === "PROVIDER"
            ? "/provider"
            : userRole === "ADMIN"
              ? "/admin"
              : "/services";
        return NextResponse.redirect(new URL(home, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/bookings/:path*",
    "/profile/:path*",
    "/provider/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
