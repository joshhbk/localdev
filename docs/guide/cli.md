# CLI Reference

All commands are run via `npx localdev <command>` or `localdev <command>` if installed globally.

## `localdev link`

Link a dependency to a local directory.

Interactive command that prompts you to:
- Select a dependency from your `package.json`
- Choose or enter the path to its local source directory
- Pick a dev command from its `package.json` scripts or enter a custom one

Writes the result to `.localdev.json` and saves it to link history.

## `localdev unlink`

Remove a linked package from `.localdev.json`.

If only one package is linked, it's selected automatically. Otherwise you're prompted to choose. The removed entry is saved to history so it can be restored with `relink`.

If no packages remain and there's no history, the `.localdev.json` file is deleted.

## `localdev relink`

Restore previously linked packages from history.

Finds all packages in the link history that aren't currently active, validates that their directories still exist and contain the expected `package.json`, and restores them to the active config.

## `localdev start`

Start dev watchers for all linked packages.

For each linked package, spawns its `dev` command in the package's directory. Writes a `.localdev.lock` heartbeat file that the bundler plugin uses to detect whether a session is active.

The session runs until you press `Ctrl+C`. On shutdown, all watchers are terminated and the heartbeat file is removed.

Only one session can run per project at a time.

## `localdev status`

Show linked packages and session state.

Displays whether a session is running (with PID and uptime), and lists all linked packages with their paths and dev commands. Warns if a linked package's directory is missing.

## `localdev tsconfig`

Print tsconfig paths that map linked packages to their source files.

Reads each linked package's `exports` field, resolves the dist entry points, and derives the corresponding source paths (e.g., `./dist/index.js` becomes `./src/index.ts`).

Outputs a JSON object suitable for merging into your `tsconfig.json` `compilerOptions.paths`, giving your editor go-to-definition into the linked package's source.
