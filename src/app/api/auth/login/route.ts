import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  createSession,
  setSessionCookie,
  checkRateLimit,
  resetRateLimit,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  // Check rate limit
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Reset rate limit on successful login
    resetRateLimit(ip);

    // Create session and set cookie
    const token = await createSession();
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
