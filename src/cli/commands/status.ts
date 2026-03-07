import { access } from "node:fs/promises";
import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import { readConfig } from "../../shared/config.js";
import {
  readHeartbeat,
  isHeartbeatAlive,
} from "../../shared/heartbeat.js";

export function formatUptime(startedAt: string, now: Date = new Date()): string {
  const totalSeconds = Math.floor(
    (now.getTime() - new Date(startedAt).getTime()) / 1000,
  );

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export const statusCommand = defineCommand({
  meta: {
    name: "status",
    description: "Show linked packages and session state",
  },
  async run() {
    const cwd = process.cwd();

    p.intro("localdev status");

    // Session state
    const alive = await isHeartbeatAlive(cwd);
    if (alive) {
      const heartbeat = await readHeartbeat(cwd);
      if (heartbeat) {
        const uptime = formatUptime(heartbeat.startedAt);
        p.log.step(`Session: running (PID ${heartbeat.pid}, up ${uptime})`);
      }
    } else {
      p.log.step("Session: not running");
    }

    // Linked packages
    const config = await readConfig(cwd);
    const entries = config ? Object.entries(config.links) : [];

    if (entries.length === 0) {
      p.outro("No packages linked.");
      return;
    }

    for (const [name, link] of entries) {
      let pathLine = `Path:     ${link.path}`;
      try {
        await access(link.path);
      } catch {
        pathLine += "  \u26A0 directory not found";
      }

      p.log.message(
        [name, pathLine, `Command:  ${link.dev}`].join("\n"),
      );
    }

    const count = entries.length;
    p.outro(`${count} package${count === 1 ? "" : "s"} linked`);
  },
});
