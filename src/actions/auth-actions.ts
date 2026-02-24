"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clearSession, setSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/schemas";

function safeInternalPath(path: string | null | undefined, fallback: string) {
  if (!path) {
    return fallback;
  }

  if (!path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }

  return path;
}

export async function registerAction(formData: FormData) {
  const rawName = formData.get("name");
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");
  const nextPath = safeInternalPath(
    formData.get("next")?.toString(),
    "/account",
  );

  const parsed = registerSchema.safeParse({
    name: rawName,
    email: rawEmail,
    password: rawPassword,
  });

  if (!parsed.success) {
    redirect(
      `/register?error=${encodeURIComponent(
        "Please provide valid registration details.",
      )}`,
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
    select: { id: true },
  });

  if (existingUser) {
    redirect(
      `/register?error=${encodeURIComponent("An account with this email exists.")}`,
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      passwordHash,
      role: "USER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  await setSession({
    uid: user.id,
    role: user.role === "ADMIN" ? "ADMIN" : "USER",
    email: user.email,
    name: user.name,
  });

  revalidatePath("/");
  redirect(nextPath);
}

export async function loginAction(formData: FormData) {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");
  const nextPath = safeInternalPath(
    formData.get("next")?.toString(),
    "/account",
  );

  const parsed = loginSchema.safeParse({
    email: rawEmail,
    password: rawPassword,
  });

  if (!parsed.success) {
    redirect(`/login?error=${encodeURIComponent("Invalid credentials.")}`);
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      passwordHash: true,
    },
  });

  if (!user) {
    redirect(`/login?error=${encodeURIComponent("Invalid credentials.")}`);
  }

  const passwordMatches = await bcrypt.compare(
    parsed.data.password,
    user.passwordHash,
  );
  if (!passwordMatches) {
    redirect(`/login?error=${encodeURIComponent("Invalid credentials.")}`);
  }

  await setSession({
    uid: user.id,
    role: user.role === "ADMIN" ? "ADMIN" : "USER",
    email: user.email,
    name: user.name,
  });

  revalidatePath("/");
  redirect(nextPath);
}

export async function logoutAction() {
  await clearSession();
  revalidatePath("/");
  redirect("/");
}
