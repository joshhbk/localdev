import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/cli/index.ts"],
    format: ["esm"],
    outDir: "dist/cli",
    dts: true,
    clean: true,
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
  {
    entry: [
      "src/plugin/vite.ts",
      "src/plugin/webpack.ts",
      "src/plugin/rspack.ts",
      "src/plugin/esbuild.ts",
      "src/plugin/rollup.ts",
    ],
    format: ["esm", "cjs"],
    outDir: "dist/plugin",
    dts: true,
    clean: false,
  },
]);
