const SAFE_LOCAL_IMAGE_PREFIX = "/uploads/";
const SAFE_REMOTE_PROTOCOLS = new Set(["http:", "https:"]);

export const MAX_PRODUCT_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_PRODUCT_IMAGE_UPLOAD_MB = Math.floor(
  MAX_PRODUCT_IMAGE_UPLOAD_BYTES / (1024 * 1024),
);

export function isSafeProductImageUrl(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return false;
  }

  if (normalized.startsWith("/")) {
    return normalized.startsWith(SAFE_LOCAL_IMAGE_PREFIX);
  }

  try {
    const url = new URL(normalized);
    return SAFE_REMOTE_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}

export function normalizeProductImageUrl(value: string | null | undefined) {
  const normalized = value?.trim();

  if (!normalized) {
    return undefined;
  }

  if (!isSafeProductImageUrl(normalized)) {
    throw new Error("Image URL must use HTTP/HTTPS or point to /uploads.");
  }

  return normalized;
}
