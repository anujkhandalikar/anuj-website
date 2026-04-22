import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect mutation routes for pages API
  if (pathname.startsWith("/api/pages")) {
    const method = request.method;

    // Allow GET requests (public read access)
    if (method === "GET") {
      return NextResponse.next();
    }

    // For mutations (POST, PUT, PATCH, DELETE), check auth
    const token = request.cookies.get("auth_session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const isValid = await verifySession(token);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/pages/:path*"],
};
