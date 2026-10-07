import "server-only";
import { randomBytes } from "node:crypto";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export type UploadKind = "image" | "cv";

/**
 * Stores a file in Vercel Blob when BLOB_READ_WRITE_TOKEN is set (production),
 * otherwise under public/uploads for local development. Returns a URL.
 * Names get a random suffix so URLs are unguessable.
 */
export async function saveUpload(file: File, kind: UploadKind): Promise<string> {
  const allowed = kind === "image" ? IMAGE_TYPES : CV_TYPES;
  const maxBytes = kind === "image" ? 4 * 1024 * 1024 : 5 * 1024 * 1024;
  if (!allowed.includes(file.type)) {
    throw new Error(kind === "image" ? "Chỉ nhận ảnh JPG, PNG, WebP, AVIF." : "Chỉ nhận file PDF hoặc Word.");
  }
  if (file.size > maxBytes) throw new Error(`File vượt quá ${maxBytes / 1024 / 1024}MB.`);

  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `${kind === "image" ? "images" : "cv"}/${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(name, file, { access: "public", contentType: file.type });
    return blob.url;
  }

  const { mkdir, writeFile } = await import("node:fs/promises");
  const path = await import("node:path");
  const dest = path.join(process.cwd(), "public", "uploads", name);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}
