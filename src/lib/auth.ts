import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { createSession as createSessionToken, verifySession } from "./session";

const COOKIE_NAME = "auth_session";
const SESSION_DURATION = 24 * 60 * 60; // 24 hours in seconds

export async function verifyPassword(password: string): Promise<boolean> {
  const storedPassword = process.env.EDIT_PASSWORD;
  if (!storedPassword) {
    console.error("EDIT_PASSWORD environment variable not set");
    return false;
  }

  // If password is already hashed (starts with $2), compare with bcrypt
  if (storedPassword.startsWith("$2")) {
    return bcrypt.compare(password, storedPassword);
  }

  // Otherwise, do direct comparison (for development)
  return password.trim() === storedPassword.trim();
}



export async function createSession(): Promise<string> {
  return createSessionToken();
}

export { verifySession };

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  return verifySession(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || record.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }

  record.count++;
  return true;
}

export function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}
