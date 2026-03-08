# What is localdev?

`localdev` is a CLI tool and bundler plugin that lets you develop npm packages locally against a consumer application — without symlinks, lockfile churn, or `node_modules` mutation.

## The problem

When you maintain an npm package used by another project, the development loop is painful. Common approaches all have drawbacks:

- **`npm link`** creates symlinks that break peer dependencies, cause duplicate module instances, and produce confusing resolution errors.
- **Monorepo workspaces** require both projects to live in the same repository.
- **`npm pack` + install** works but requires a manual build-pack-install cycle on every change.

## The approach

`localdev` solves this at the bundler level. Instead of modifying `node_modules` or the lockfile, it tells your bundler to resolve specific packages from their local source directories.

The system has two halves:

- A **CLI** that manages config, spawns dev watchers for your linked packages, and maintains a heartbeat file so the plugin knows the session is active.
- A **bundler plugin** that reads the config, checks if a session is running, and rewrites module resolution for linked packages.

When `localdev start` is running, your bundler resolves linked packages from their local directories. When it's not running, the plugin is a no-op and your builds behave normally.
