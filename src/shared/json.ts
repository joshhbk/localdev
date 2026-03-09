import { readFile, writeFile } from "node:fs/promises";

export function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseJson<T>(
  raw: string,
  guard: (value: unknown) => value is T,
): T | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    return guard(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function readJsonFile<T>(
  path: string,
  guard: (value: unknown) => value is T,
): Promise<T | null> {
  try {
    const raw = await readFile(path, "utf-8");
    return parseJson(raw, guard);
  } catch {
    return null;
  }
}

export async function writeJsonFile(
  path: string,
  data: unknown,
): Promise<void> {
  await writeFile(path, JSON.stringify(data, null, 2) + "\n", "utf-8");
}
