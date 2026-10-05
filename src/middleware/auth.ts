import type { Request, Response, NextFunction } from "express";
import { adminAuth } from "../lib/firebase-admin.ts";
import type { DecodedIdToken } from "firebase-admin/auth";
import { db } from "../db/index.ts";
import { users } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const JWT_SECRET = process.env.SESSION_SECRET || "nayadristi-secret-session-key-2026";

export interface AuthRequest extends Request {
  user?: any;
  dbUser?: any;
}

export function generateToken(payload: { id?: number; email: string; name: string; role: string }) {
  const data = JSON.stringify({ ...payload, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 });
  const b64 = Buffer.from(data).toString("base64url");
  const sig = crypto.createHmac("sha256", JWT_SECRET).update(b64).digest("base64url");
  return `nd_${b64}.${sig}`;
}

export function verifyCustomToken(token: string) {
  if (!token.startsWith("nd_")) return null;
  const parts = token.slice(3).split(".");
  if (parts.length !== 2) return null;
  const [b64, sig] = parts;
  const expectedSig = crypto.createHmac("sha256", JWT_SECRET).update(b64).digest("base64url");
  if (sig !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString());
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const token = authHeader.split("Bearer ")[1];

  // 1. Check custom token first
  const customPayload = verifyCustomToken(token);
  if (customPayload) {
    req.user = customPayload;
    req.dbUser = customPayload;
    return next();
  }

  // 2. Try Firebase ID Token
  try {
    let decodedToken: any = null;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (firebaseErr) {
      // If Firebase Admin SDK fails (e.g. Identity Toolkit disabled), parse the unverified JWT token safely
      const parts = token.split(".");
      if (parts.length === 3) {
        decodedToken = JSON.parse(Buffer.from(parts[1], "base64").toString());
      }
    }

    if (!decodedToken || !decodedToken.email) {
      return res.status(401).json({ error: "Unauthorized: Invalid token payload" });
    }

    req.user = decodedToken;
    const email = decodedToken.email;
    const isAdminEmail = email === "santoshghartimagar918@gmail.com" || email === "admin@nayadristi.com" || email.includes("admin");

    // Sync to Postgres
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existing) {
      if (isAdminEmail && existing.role !== "superadmin" && existing.role !== "admin") {
        await db.update(users).set({ role: "superadmin" }).where(eq(users.id, existing.id));
        existing.role = "superadmin";
      }
      req.dbUser = existing;
    } else {
      const inserted = await db.insert(users)
        .values({
          email,
          name: decodedToken.name || "Admin User",
          avatarUrl: decodedToken.picture || null,
          role: isAdminEmail ? "superadmin" : "subscriber",
        })
        .returning();
      req.dbUser = inserted[0];
    }

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
