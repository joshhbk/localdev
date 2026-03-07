import { defineCommand } from "citty";

export const linkCommand = defineCommand({
  meta: {
    name: "link",
    description: "Link a dependency to a local directory",
  },
  async run() {
    // TODO: interactive TUI flow using @clack/prompts
    console.log("localdev link — not yet implemented");
  },
});
