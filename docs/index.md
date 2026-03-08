---
layout: home
hero:
  name: localdev
  tagline: Develop local npm packages against real consumer apps without modifying node_modules or your lockfile.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: How It Works
      link: /guide/how-it-works
features:
  - title: Bundler-level resolution
    details: The bundler plugin resolves linked packages from local directories. Your node_modules and lockfile stay untouched.
  - title: Works with your stack
    details: Supports Vite, Webpack, Rspack, esbuild, and Rollup through a shared plugin core with thin adapters per bundler.
  - title: Safe when inactive
    details: When localdev isn't running, the plugin does nothing. Builds behave the same as without it installed.
---
