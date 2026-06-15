# Project Setup

## New Project

Prefer the current official Unibest flow for a Vue 3 + Vite project:

```bash
pnpm create unibest
```

Inspect current CLI prompts instead of hard-coding flags. Select only required
features. Record the chosen UI library, request library, route/layout plugins,
targets, language policy, and package manager. When language is unspecified,
keep page SFCs lightweight in JavaScript and use TypeScript selectively at
shared contracts and infrastructure boundaries.

After generation:

1. Pin the package manager through `packageManager`.
2. Commit the lockfile.
3. Inspect scripts and run the unmodified H5 and target mini-program builds.
4. Configure app IDs and platform-specific settings outside shared source where
   practical.
5. Add CI commands for typecheck, lint, and each supported build target.
6. When Wot UI is selected, confirm exactly one v2 installation:
   `@wot-ui/ui@^2` for npm or `uni_modules/wot-ui`. Reject
   `wot-design-uni`, mixed majors, and duplicate npm plus `uni_modules`
   installation.
7. Run
   `node <skill-root>/scripts/audit-uniapp-project.mjs <project-root>`.
8. Inventory template examples, demo pages, optional plugins, assets, and
   dependencies. Remove them only after the chosen project features are clear.

Do not immediately delete generated template code before the first clean builds;
some files may be required by generated routing, auto imports, conditional
compilation, or selected template features. Perform the project cleanup pass
after the actual application structure is established.

## Project Delivery Order

Build one minimal vertical slice before broad shared abstractions:

1. Confirm the primary user flow, failure states, targets, and API contract.
2. Establish clean H5 and mini-program builds.
3. Connect app bootstrap/auth, request boundary, one real page flow, and its
   loading/empty/error/retry states.
4. Extract page-private components for readability when useful. Extract shared
   components, composables, or stores only when the completed slice proves the
   responsibility; use adapters for real platform/provider boundaries.
5. Add remaining features, cross-target verification, release checks, and final
   cleanup.

Do not prebuild every store, service, component wrapper, adapter, or Mock
handler before one real workflow works end to end.

## Existing Project Discovery

Use this order:

1. Lockfile: `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`.
2. `package.json` scripts and dependency families.
3. `vite.config.*` plugin order.
4. `pages.config.*` / `pages.json` ownership and routing approach.
5. `manifest.config.*` / `manifest.json` target configuration.
6. `uno.config.*`, Wot UI resolver/config and installed major, auto imports.
7. Existing request, auth, stores, environment, and platform adapters.

Do not add a second router, state library, request client, or component library
until the existing choice is proven insufficient.

## Environment Configuration

Use one environment access module, for example `src/config/env.js` or the
repository's existing typed equivalent. Validate required values at
startup/build time. When new or nearby public configuration changes by
environment, deployment, or target, extract it into that boundary as part of
the current change.

- Public API base URLs and feature flags may use client environment variables.
- Secrets, private keys, and signing credentials must stay server-side.
- Keep dev/test/prod endpoints explicit.
- Handle H5 proxy configuration separately from mini-program domain allowlists.
- Keep stable business constants out of environment files.
- Do not read `import.meta.env` throughout business code.

See [environment-configuration.md](environment-configuration.md) for
classification and minimal consolidation rules.

## Generated Files

Unibest commonly uses file-based routing, layouts, auto imports, and generated
types. Follow repository comments and plugin docs. Prefer editing source page
metadata or config inputs, then regenerate. Never repair generated output by
hand.
