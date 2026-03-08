---
layout: home
hero:
  name: localdev
  tagline: Zero-choreography local npm package development across repos
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: How It Works
      link: /guide/how-it-works
features:
  - title: No symlinks
    details: Resolves linked packages at the bundler level. No npm link, no lockfile churn, no node_modules mutation.
  - title: Any bundler
    details: Works with Vite, Webpack, Rspack, esbuild, and Rollup via a single unplugin-based core.
  - title: Safe by default
    details: When localdev isn't running, the plugin is a no-op. Your builds behave exactly as they normally would.
---
