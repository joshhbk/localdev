# Getting Started

## Install

```bash
npm install localdev --save-dev
```

## Add the plugin to your bundler

::: code-group

```ts [Vite]
// vite.config.ts
import localdev from "localdev/vite";

export default defineConfig({
  plugins: [localdev()],
});
```

```ts [Webpack]
// webpack.config.js
import localdev from "localdev/webpack";

export default {
  plugins: [localdev()],
};
```

```ts [Rspack]
// rspack.config.js
import localdev from "localdev/rspack";

export default {
  plugins: [localdev()],
};
```

```ts [esbuild]
import localdev from "localdev/esbuild";
import esbuild from "esbuild";

esbuild.build({
  plugins: [localdev()],
});
```

```ts [Rollup]
// rollup.config.js
import localdev from "localdev/rollup";

export default {
  plugins: [localdev()],
};
```

:::

## Link a local package

```bash
npx localdev link
```

This interactive command walks you through:

1. Picking a dependency from your `package.json`
2. Pointing it at a local directory (auto-discovered from nearby directories)
3. Choosing a dev command (picked from the package's scripts)

The result is a `.localdev.json` file in your project root. Add it and `.localdev.lock` to your `.gitignore`.

## Start dev watchers

```bash
npx localdev start
```

This spawns the dev command for each linked package and keeps a heartbeat file so the bundler plugin knows the session is active. Your bundler will now resolve linked packages from their local directories.

Press `Ctrl+C` to stop.
