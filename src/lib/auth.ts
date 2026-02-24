import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/lib/types";

const SESSION_COOKIE = "ecom_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const DEFAULT_AUTH_SECRET = "dev-only-secret-change-before-production";

const authSecret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? DEFAULT_AUTH_SECRET,
);
const validRoles = new Set<UserRole>(["USER", "ADMIN"]);

type SessionPayload = {
  uid: string;
  role: UserRole;
  email: string;
  name: string;
};

async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(authSecret);
}

export async function setSession(payload: SessionPayload) {
  const token = await signSession(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, authSecret);
    const payload = verified.payload as Partial<SessionPayload>;

    if (
      !payload.uid ||
      !payload.email ||
      !payload.name ||
      !payload.role ||
      !validRoles.has(payload.role as UserRole)
    ) {
      return null;
    }

    return {
      uid: payload.uid,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    } as SessionPayload;
  } catch {
    return null;
  }
}

export const getCurrentUser = cache(async () => {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.uid },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
});

function resolveNextPath(nextPath: string | undefined, fallback: string) {
  if (!nextPath) {
    return fallback;
  }

  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return fallback;
  }

  return nextPath;
}

export async function requireUser(nextPath?: string) {
  const user = await getCurrentUser();
  if (!user) {
    const destination = resolveNextPath(nextPath, "/account");
    const encoded = encodeURIComponent(destination);
    redirect(`/login?next=${encoded}`);
  }

  return user;
}

export async function requireAdmin(nextPath?: string) {
  const user = await requireUser(nextPath ?? "/admin");
  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return user;
}
