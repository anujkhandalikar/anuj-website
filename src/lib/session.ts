import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production"
);

export async function verifySession(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.authenticated === true;
  } catch {
    return false;
  }
}

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  return token;
}
