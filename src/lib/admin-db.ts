import "server-only";
import { connection } from "next/server";
import { getDb } from "./db";

/** Admin pages always render per request (never prerendered). */
export async function adminDb() {
  await connection();
  return getDb();
}
