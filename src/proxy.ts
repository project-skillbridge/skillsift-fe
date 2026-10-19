import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import type { UserRole } from "@/types/api";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

const ROLE_PROTECTED_ROUTES: { path: string; role: UserRole }[] = [
  { path: "/t", role: "talent" },
  { path: "/talent", role: "talent" },
  { path: "/e", role: "employer" },
  { path: "/employer/onboarding", role: "employer" },
];

/** Routes a signed-in user should never see — they're redirected to their dashboard. */
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

function dashboardPathForRole(role: UserRole | undefined): string {
  if (role === "talent") return "/t/dashboard";
  if (role === "employer") return "/e/dashboard";
  return "/";
}

function continueWithSecurityHeaders(request: Request): NextResponse {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  response.headers.set("x-request-id", requestId);

  return response;
}

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;
  const user = request.auth?.user as
    { id?: string; role?: UserRole } | undefined;

  // Keep signed-in users out of the auth pages.
  const isAuthRoute = AUTH_ROUTES.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  if (user?.id && isAuthRoute) {
    return NextResponse.redirect(
      new URL(dashboardPathForRole(user.role), request.url),
    );
  }

  const protectedRoute = ROLE_PROTECTED_ROUTES.find(
    ({ path }) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (protectedRoute) {
    if (!user?.id) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user.role !== protectedRoute.role) {
      return NextResponse.redirect(
        new URL(dashboardPathForRole(user.role), request.url),
      );
    }
  }

  return continueWithSecurityHeaders(request);
});

export const config = {
  matcher: [
    "/((?!backend|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
