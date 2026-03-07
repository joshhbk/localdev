import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  getHeartbeatPath,
  writeHeartbeat,
  readHeartbeat,
  isHeartbeatAlive,
  removeHeartbeat,
} from "./heartbeat.js";

describe("heartbeat", () => {
  let dir: string;

  async function makeTempDir() {
    dir = join(
      tmpdir(),
      `localdev-hb-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    );
    await mkdir(dir, { recursive: true });
    return dir;
  }

  afterEach(async () => {
    if (dir) {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("getHeartbeatPath resolves .localdev.lock in project root", () => {
    expect(getHeartbeatPath("/some/project")).toBe(
      join("/some/project", ".localdev.lock"),
    );
  });

  it("write/read round-trip", async () => {
    await makeTempDir();
    const manifest = {
      pid: process.pid,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      watching: ["@acme/ui", "@acme/core"],
    };
    await writeHeartbeat(dir, manifest);
    const result = await readHeartbeat(dir);
    expect(result).toEqual(manifest);
  });

  it("readHeartbeat returns null for missing file", async () => {
    await makeTempDir();
    const result = await readHeartbeat(dir);
    expect(result).toBeNull();
  });

  it("readHeartbeat returns null for malformed JSON", async () => {
    await makeTempDir();
    await writeFile(join(dir, ".localdev.lock"), "not json{{{", "utf-8");
    const result = await readHeartbeat(dir);
    expect(result).toBeNull();
  });

  it("isHeartbeatAlive returns true for current PID + fresh timestamp", async () => {
    await makeTempDir();
    await writeHeartbeat(dir, {
      pid: process.pid,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      watching: ["pkg"],
    });
    expect(await isHeartbeatAlive(dir)).toBe(true);
  });

  it("isHeartbeatAlive returns false for dead PID", async () => {
    await makeTempDir();
    // PID 999999 is almost certainly not running
    await writeHeartbeat(dir, {
      pid: 999999,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      watching: ["pkg"],
    });
    expect(await isHeartbeatAlive(dir)).toBe(false);
  });

  it("isHeartbeatAlive returns false for stale timestamp", async () => {
    await makeTempDir();
    const stale = new Date(Date.now() - 30_000).toISOString();
    await writeHeartbeat(dir, {
      pid: process.pid,
      startedAt: stale,
      updatedAt: stale,
      watching: ["pkg"],
    });
    expect(await isHeartbeatAlive(dir)).toBe(false);
  });

  it("isHeartbeatAlive returns false for missing file", async () => {
    await makeTempDir();
    expect(await isHeartbeatAlive(dir)).toBe(false);
  });

  it("removeHeartbeat deletes the file", async () => {
    await makeTempDir();
    await writeHeartbeat(dir, {
      pid: process.pid,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      watching: ["pkg"],
    });
    await removeHeartbeat(dir);
    expect(await readHeartbeat(dir)).toBeNull();
  });

  it("removeHeartbeat is idempotent", async () => {
    await makeTempDir();
    await removeHeartbeat(dir);
    await removeHeartbeat(dir);
    // no throw
  });
});
