import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeToken(token: string): { id: string; email: string; role: string } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = Buffer.from(payload, "base64url").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("PLATFORM_ACCESS_TOKEN")?.value;
  const user = token ? decodeToken(token) : null;

  // Redirect authenticated users away from login/register
  if (user && (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register"))) {
    if (user.role === "admin" || user.role === "operator") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/contractors", request.url));
  }

  // Protect admin routes — only admin/operator
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (user.role !== "admin" && user.role !== "operator") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Protect contractor routes — only contractors
  if (pathname.startsWith("/contractors")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    if (user.role !== "contractor") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/contractors/:path*", "/auth/login", "/auth/register"],
};
