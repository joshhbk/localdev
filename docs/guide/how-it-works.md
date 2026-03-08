# How It Works

## Architecture

`localdev` has two runtime halves that communicate through a filesystem contract:

```
┌─────────────────┐                          ┌─────────────────┐
│                 │    .localdev.json         │                 │
│   CLI           │ ──────────────────────▶   │   Bundler       │
│   (localdev     │                          │   Plugin        │
│    start)       │    .localdev.lock         │   (unplugin)    │
│                 │ ──────────────────────▶   │                 │
└─────────────────┘                          └─────────────────┘
```

- The **CLI** writes `.localdev.json` (config) and `.localdev.lock` (heartbeat)
- The **plugin** reads both files to decide whether and how to rewrite module resolution

There is no shared runtime state, no sockets, and no IPC. The two halves are fully decoupled.

## Resolution

When the bundler encounters an import of a linked package, the plugin:

1. Checks if a session is active (heartbeat is fresh and the PID is alive)
2. Looks up the package name in `.localdev.json`
3. Reads the linked package's `package.json` to find its `exports` entry points
4. Resolves the import to the corresponding file in the local package directory

For example, if your app imports `@myorg/shared` and the package's `exports` field maps `.` to `./dist/index.js`, the plugin resolves the import to `../shared/dist/index.js` (relative to the linked path).

## Export conditions

The plugin respects the `exports` field in the linked package's `package.json`, including conditional exports. By default it resolves using the `import`, `module`, and `default` conditions, matching standard ESM resolution.

Subpath exports (e.g., `@myorg/shared/utils`) are also supported — the plugin reads all export subpaths and resolves each one independently.

## Heartbeat

The heartbeat mechanism prevents stale config from affecting builds. Without it, a crashed `localdev start` session would leave `.localdev.json` pointing at local directories while no watcher is rebuilding them — leading to confusing stale-build errors.

The CLI writes `.localdev.lock` with the current PID and timestamp, and refreshes it every 5 seconds. The plugin checks that the file is recent and the process is alive before activating resolution. If either check fails, the plugin behaves as a no-op.

## Vite integration

The Vite plugin has deeper integration than the other bundler adapters:

- **Config watching**: Restarts the Vite dev server when `.localdev.json` or `.localdev.lock` changes
- **Cache clearing**: Clears Vite's module graph cache on restart to avoid stale resolutions
- **Watch roots**: Adds linked package directories to Vite's file watcher so changes trigger HMR

The other bundler adapters (Webpack, Rspack, esbuild, Rollup) provide the core resolution behavior but don't yet have equivalent lifecycle integration.
