"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  AGE_GATE_COOKIE,
  AGE_GATE_MAX_AGE,
  resolveSafeNextPath,
} from "@/lib/age-gate";

export async function confirmAgeGateAction(formData: FormData) {
  const answer = formData.get("isOfAge")?.toString();
  const nextPath = resolveSafeNextPath(formData.get("next")?.toString(), "/");

  if (answer !== "yes") {
    redirect(
      "/age-gate?error=Access was not confirmed for this preview environment.",
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(AGE_GATE_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AGE_GATE_MAX_AGE,
  });

  redirect(nextPath);
}
