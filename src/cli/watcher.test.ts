import { describe, expect, it } from "vitest";
import { spawnWatcher, killAllWatchers } from "./watcher.js";

describe("killAllWatchers", () => {
  it(
    "escalates to SIGKILL when process ignores SIGTERM",
    { timeout: 15_000 },
    async () => {
      // Trap SIGTERM so the process ignores it — only SIGKILL will work
      const watcher = spawnWatcher(
        "test-pkg",
        `exec node -e "process.on('SIGTERM', () => {}); setTimeout(() => {}, 60000)"`,
        {
          cwd: process.cwd(),
          onStdout: () => {},
          onStderr: () => {},
          onExit: () => {},
        },
      );

      expect(watcher.exited).toBe(false);
      await killAllWatchers([watcher], 500);
      expect(watcher.exited).toBe(true);
    },
  );
});
