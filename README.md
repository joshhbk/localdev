# samhail

Develop local npm packages against a consumer app without symlinks, lockfile changes, or `node_modules` mutation. Resolves linked packages at the bundler level.

## Install

```bash
npm install samhail --save-dev
```

## Quick start

### 1. Add the plugin to your bundler

```ts
// vite.config.ts
import samhail from "samhail/vite";

export default defineConfig({
  plugins: [samhail()],
});
```

Also available for Webpack, Rspack, esbuild, and Rollup:

```ts
import samhail from "samhail/webpack";
import samhail from "samhail/rspack";
import samhail from "samhail/esbuild";
import samhail from "samhail/rollup";
```

### 2. Link a local package

```bash
npx samhail link
```

This walks you through picking a dependency and pointing it at a local directory. The result is a `.samhail.json` file in your project root.

### 3. Start a session

```bash
npx samhail start
```

This activates the session and maintains a heartbeat file (`.samhail.lock`). While running, the bundler plugin resolves linked packages from their local directories instead of `node_modules`.

Run your package build commands separately (in other terminals, via your task runner, etc).

Press `Ctrl+C` to stop.

## CLI commands

| Command            | Description                                     |
| ------------------ | ----------------------------------------------- |
| `samhail link`     | Link a dependency to a local directory          |
| `samhail unlink`   | Remove a linked package                         |
| `samhail relink`   | Restore previously linked packages from history |
| `samhail start`    | Start a session for linked packages             |
| `samhail status`   | Show linked packages and session state          |
| `samhail tsconfig` | Print tsconfig paths for linked packages        |

## How it works

The system has two halves that communicate through a small filesystem contract:

- **CLI** manages config (`.samhail.json`) and session state (`.samhail.lock`)
- **Bundler plugin** reads the config, checks if a session is active, and rewrites module resolution for linked packages

When `samhail start` is running, the plugin resolves imports of linked packages to their local directories. When it's not running, the plugin is a no-op and your bundler behaves normally.

## Config

`samhail link` generates a `.samhail.json` file:

```json
{
  "links": {
    "@myorg/shared": {
      "path": "../shared"
    }
  }
}
```

Add `.samhail.json` and `.samhail.lock` to your `.gitignore`.

## License

MIT
