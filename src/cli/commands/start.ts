import { defineCommand } from "citty";

export const startCommand = defineCommand({
  meta: {
    name: "start",
    description: "Start dev watchers for all linked packages",
  },
  async run() {
    // TODO: read config, spawn watchers with execa, write heartbeat
    console.log("localdev start — not yet implemented");
  },
});
