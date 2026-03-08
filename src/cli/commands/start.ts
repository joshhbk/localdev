import { access } from "node:fs/promises";
import { resolve } from "node:path";
import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { readConfig } from "../../shared/config.js";
import {
  getHeartbeatStatus,
  removeHeartbeat,
  writeHeartbeat,
} from "../../shared/heartbeat.js";
import type { HeartbeatManifest } from "../../shared/types.js";
import {
  spawnWatcher,
  killAllWatchers,
  type WatcherProcess,
} from "../watcher.js";

export const startCommand = defineCommand({
  meta: {
    name: "start",
    description: "Start dev watchers for all linked packages",
  },
  async run() {
    const cwd = process.cwd();

    p.intro("localdev start");

    // 1. Read config
    const config = await readConfig(cwd);
    if (!config || Object.keys(config.links).length === 0) {
      p.log.error(
        "No .localdev.json found or no links configured. Run `localdev link` first.",
      );
      p.outro("Nothing to do.");
      process.exit(1);
    }

    const linkEntries = Object.entries(config.links);

    // 2. Validate all link paths exist
    for (const [name, link] of linkEntries) {
      const dir = resolve(cwd, link.path);
      try {
        await access(dir);
      } catch {
        p.log.error(`Package directory not found for "${name}": ${dir}`);
        p.outro("Fix your .localdev.json and try again.");
        process.exit(1);
      }
    }

    // 3. Check for existing heartbeat
    const heartbeatStatus = await getHeartbeatStatus(cwd);
    if (heartbeatStatus.state === "active") {
      const existing = heartbeatStatus.manifest;
      if (existing) {
        p.log.error(
          `Another localdev session is already running (PID ${existing.pid}).`,
        );
        p.outro("Stop it first or remove .localdev.lock.");
        process.exit(1);
      }
    }

    if (
      heartbeatStatus.state === "stale" ||
      heartbeatStatus.state === "dead"
    ) {
      p.log.warn("Cleaning up stale .localdev.lock from a previous session.");
      await removeHeartbeat(cwd);
    }

    // 4. Spawn watchers
    const watchers: WatcherProcess[] = [];
    const packageNames = linkEntries.map(([name]) => name);

    for (const [name, link] of linkEntries) {
      const packageDir = resolve(cwd, link.path);
      p.log.step(`Starting watcher: ${name} → ${link.dev}`);

      const watcher = spawnWatcher(name, link.dev, {
        cwd: packageDir,
        onStdout: (data) => {
          for (const line of data.trimEnd().split("\n")) {
            p.log.message(`[${name}] ${line}`);
          }
        },
        onStderr: (data) => {
          for (const line of data.trimEnd().split("\n")) {
            p.log.warn(`[${name}] ${line}`);
          }
        },
        onExit: (code) => {
          if (code !== 0) {
            p.log.error(`[${name}] exited with code ${code}`);
          } else {
            p.log.message(`[${name}] exited`);
          }
        },
      });

      watchers.push(watcher);
    }

    // 5. Write initial heartbeat + refresh interval
    const startedAt = new Date().toISOString();

    const refreshHeartbeat = async () => {
      const manifest: HeartbeatManifest = {
        pid: process.pid,
        startedAt,
        updatedAt: new Date().toISOString(),
        watching: packageNames,
      };
      await writeHeartbeat(cwd, manifest);
    };

    await refreshHeartbeat();
    const heartbeatInterval = setInterval(refreshHeartbeat, 5000);

    p.log.step(
      `Watching ${packageNames.length} package${packageNames.length === 1 ? "" : "s"}. Press Ctrl+C to stop.`,
    );

    // 6. Graceful shutdown
    let shuttingDown = false;
    const shutdown = async () => {
      if (shuttingDown) return;
      shuttingDown = true;
      clearInterval(heartbeatInterval);
      p.log.step("Shutting down watchers...");
      await killAllWatchers(watchers);
      await removeHeartbeat(cwd);
      p.outro("localdev stopped.");
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  },
});
