import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hostname = request.headers.get("host") || "";
  if (hostname === "brandworld.anujk.in" || hostname.startsWith("brandworld.localhost")) {
    return NextResponse.redirect("https://docs.google.com/presentation/d/13ltzgvgHhaldB3GX_h5TzlIi44cmql7dZ1J0DPlPWFI/edit?slide=id.g3e01e99e63a_2_2#slide=id.g3e01e99e63a_2_2");
  }

  if (hostname === "chotu.anujk.in" || hostname.startsWith("chotu.localhost")) {
    return NextResponse.rewrite(new URL("/chotu", request.url));
  }

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
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
