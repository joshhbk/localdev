import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { LocaldevConfig } from "./types.js";

const CONFIG_FILENAME = ".localdev.json";

export function getConfigPath(projectRoot: string): string {
  return resolve(projectRoot, CONFIG_FILENAME);
}

export async function readConfig(
  projectRoot: string,
): Promise<LocaldevConfig | null> {
  try {
    const raw = await readFile(getConfigPath(projectRoot), "utf-8");
    return JSON.parse(raw) as LocaldevConfig;
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
