import { readFile, writeFile, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import { parseJson } from "./json.js";
import type { HeartbeatManifest } from "./types.js";

const HEARTBEAT_FILENAME = ".localdev.lock";
const STALENESS_THRESHOLD_MS = 10_000;

function isHeartbeatManifest(value: unknown): value is HeartbeatManifest {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.pid === "number" &&
    typeof obj.startedAt === "string" &&
    typeof obj.updatedAt === "string" &&
    Array.isArray(obj.watching) &&
    obj.watching.every((v: unknown) => typeof v === "string")
  );
}

export function getHeartbeatPath(projectRoot: string): string {
  return resolve(projectRoot, HEARTBEAT_FILENAME);
}

export async function writeHeartbeat(
  projectRoot: string,
  manifest: HeartbeatManifest,
): Promise<void> {
  await writeFile(
    getHeartbeatPath(projectRoot),
    JSON.stringify(manifest, null, 2) + "\n",
    "utf-8",
  );
}

export async function readHeartbeat(
  projectRoot: string,
): Promise<HeartbeatManifest | null> {
  try {
    const raw = await readFile(getHeartbeatPath(projectRoot), "utf-8");
    return parseJson(raw, isHeartbeatManifest);
  } catch {
    return null;
  }
}

function isPidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export async function isHeartbeatAlive(
  projectRoot: string,
): Promise<boolean> {
  const manifest = await readHeartbeat(projectRoot);
  if (!manifest) return false;

  if (!isPidAlive(manifest.pid)) return false;

  const age = Date.now() - new Date(manifest.updatedAt).getTime();
  return age < STALENESS_THRESHOLD_MS;
}

export async function removeHeartbeat(
  projectRoot: string,
): Promise<void> {
  try {
    await unlink(getHeartbeatPath(projectRoot));
  } catch {
    // ignore if missing
  }
}
