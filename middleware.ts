// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  console.log("Path:", pathname);
  console.log("Token exists:", !!token);
  console.log("Token:", token);
  console.log("User role:", token?.role);

  // No token → redirect to login
  if (
    !token &&
    (pathname.startsWith("/admin") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/home"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Admin routes → only allow role=admin
  if (pathname.startsWith("/admin")) {
    if (token?.role !== "admin") {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // User routes → only allow logged in users
  if (pathname.startsWith("/home") || pathname.startsWith("/profile")) {
    if (!token || (token?.role !== "user" && token?.role !== "admin")) {
      console.log("Redirecting to sign-in: no token or invalid role");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/home/:path*", "/profile/:path*"], // Protect all /admin/* and /user/* routes
};
