# Getting Started

## Install

```bash
npm install localdev --save-dev
```

## Add the plugin

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

The Vite adapter has the deepest integration — it watches for config changes, clears the module cache, and adds linked package directories to the file watcher for HMR. The other adapters handle resolution but don't yet hook into their bundler's dev lifecycle.

## Link a package

```bash
npx localdev link
```

This walks you through picking a dependency from your `package.json`, pointing it at a local directory, and choosing a dev command. localdev looks for matching packages in sibling and nearby directories, so you usually won't need to type a path manually.

The result is a `.localdev.json` file in your project root. Add it and `.localdev.lock` to your `.gitignore`.

## Start

```bash
npx localdev start
```

This spawns the dev command for each linked package. While it's running, the bundler plugin resolves those packages from their local directories instead of `node_modules`.

`Ctrl+C` to stop. The heartbeat file is cleaned up and the plugin goes back to normal behavior.
