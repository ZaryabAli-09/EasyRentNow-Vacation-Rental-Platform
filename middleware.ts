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

  // Admin routes → only allow role=admin
  if (pathname.startsWith("/admin")) {
    if (!token || token?.role !== "admin") {
      console.log(
        "Admin route: redirecting - token:",
        !!token,
        "role:",
        token?.role,
      );
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // User routes → allow logged in users with user or admin role
  if (pathname.startsWith("/home/create") || pathname.startsWith("/profile")) {
    if (!token || (token?.role !== "user" && token?.role !== "admin")) {
      console.log(
        "User route: redirecting - token:",
        !!token,
        "role:",
        token?.role,
      );
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/home/create/:path*", "/profile/:path*"], // Protect all /admin/* and /user/* routes
};
