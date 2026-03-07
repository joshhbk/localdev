import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseJson } from "./json.js";
import type { LocaldevConfig } from "./types.js";

const CONFIG_FILENAME = ".localdev.json";

function isLocaldevConfig(value: unknown): value is LocaldevConfig {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  if (typeof obj.links !== "object" || obj.links === null) return false;
  return Object.values(obj.links as Record<string, unknown>).every(
    (link) =>
      typeof link === "object" &&
      link !== null &&
      typeof (link as Record<string, unknown>).path === "string" &&
      typeof (link as Record<string, unknown>).dev === "string",
  );
}

export function getConfigPath(projectRoot: string): string {
  return resolve(projectRoot, CONFIG_FILENAME);
}

export async function readConfig(
  projectRoot: string,
): Promise<LocaldevConfig | null> {
  try {
    const raw = await readFile(getConfigPath(projectRoot), "utf-8");
    return parseJson(raw, isLocaldevConfig);
  } catch {
    return null;
  }
}

export async function writeConfig(
  projectRoot: string,
  config: LocaldevConfig,
): Promise<void> {
  await writeFile(
    getConfigPath(projectRoot),
    JSON.stringify(config, null, 2) + "\n",
    "utf-8",
  );
}
