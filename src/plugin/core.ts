import { createUnplugin } from "unplugin";
import { readConfig } from "../shared/config.js";
import type { LocaldevConfig } from "../shared/types.js";

export interface LocaldevPluginOptions {
  /** Project root directory. Defaults to process.cwd() */
  cwd?: string;
}

export const unplugin = createUnplugin((options?: LocaldevPluginOptions) => {
  const cwd = options?.cwd ?? process.cwd();
  let config: LocaldevConfig | null = null;

  return {
    name: "localdev",

    async buildStart() {
      config = await readConfig(cwd);
    },

    resolveId(id) {
      if (!config) return null;

      const link = config.links[id];
      if (!link) return null;

      // TODO: resolve to the linked package's dist entry point
      return null;
    },
  };
});
