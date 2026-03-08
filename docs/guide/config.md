# Config Reference

## `.localdev.json`

Created by `localdev link`. This is the main config file that tells the bundler plugin which packages to resolve locally.

```json
{
  "links": {
    "@myorg/shared": {
      "path": "../shared",
      "dev": "tsup --watch"
    }
  },
  "history": {
    "@myorg/utils": {
      "path": "../utils",
      "dev": "tsc --watch"
    }
  }
}
```

### `links`

Active linked packages. Each key is the npm package name, and the value contains:

| Field  | Type     | Description                                           |
| ------ | -------- | ----------------------------------------------------- |
| `path` | `string` | Relative or absolute path to the local package directory |
| `dev`  | `string` | Command to run for watching/rebuilding the package    |

### `history`

Previously linked packages that were removed with `localdev unlink`. Used by `localdev relink` to restore packages without re-entering paths and commands. Same shape as `links`.

## `.localdev.lock`

Written by `localdev start`. This heartbeat file tells the bundler plugin whether a session is active. It's updated every 5 seconds while the session is running.

```json
{
  "pid": 12345,
  "startedAt": "2026-03-08T12:00:00.000Z",
  "updatedAt": "2026-03-08T12:05:00.000Z",
  "watching": ["@myorg/shared"]
}
```

The plugin considers a session active when:
- The file exists and is valid JSON
- The `updatedAt` timestamp is less than 10 seconds old
- The process at `pid` is still alive

Both files should be added to `.gitignore`.
