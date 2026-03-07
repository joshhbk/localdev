import { defineCommand, runMain } from "citty";
import { linkCommand } from "./commands/link.js";
import { startCommand } from "./commands/start.js";

const main = defineCommand({
  meta: {
    name: "localdev",
    version: "0.1.0",
    description:
      "Zero-choreography local npm package development across repos",
  },
  subCommands: {
    link: linkCommand,
    start: startCommand,
  },
});

runMain(main);
