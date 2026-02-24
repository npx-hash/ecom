import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function extensionFromMimeType(mimeType: string) {
  if (mimeType === "image/jpeg") {
    return "jpg";
  }

  if (mimeType === "image/png") {
    return "png";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  if (mimeType === "image/gif") {
    return "gif";
  }

  return "bin";
}

export async function saveUploadedImage(file: File) {
  if (!allowedMimeTypes.has(file.type)) {
    throw new Error("Unsupported image format.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = extensionFromMimeType(file.type);
  const filename = `${randomUUID()}.${ext}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  const filepath = path.join(directory, filename);

  await mkdir(directory, { recursive: true });
  await writeFile(filepath, buffer);

  return `/uploads/${filename}`;
}
