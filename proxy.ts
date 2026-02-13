import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page through
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // All other /admin routes are protected at the page level via auth() checks
  // The proxy just ensures the routes are reachable
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
