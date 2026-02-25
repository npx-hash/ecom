export const AGE_GATE_COOKIE = "template_preview_verified";
export const AGE_GATE_MAX_AGE = 60 * 60 * 24 * 30;

export function resolveSafeNextPath(
  nextPath: string | null | undefined,
  fallback = "/",
) {
  if (!nextPath) {
    return fallback;
  }

  if (!nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return fallback;
  }

  return nextPath;
}
