# Environment And Public Configuration

## Automatic Extraction Rule

While creating or changing code, inspect new and nearby configuration values.
Automatically extract a value when it is public and changes by build
environment, deployment, or target. Put the raw value in the repository's
existing environment files and expose one normalized value from
`src/config/env.js` or the existing equivalent.

Business code imports the normalized config module. It must not read
`import.meta.env` directly.

Do not extract merely because a literal is reused. Classify it first:

| Value | Owner |
|---|---|
| Public API/CDN/upload base URL, public app identifier, build feature switch, log switch | Environment file -> config module |
| Secret, signing key, private credential | Server or secret manager; never client environment |
| Stable business status, route name, timeout, enum, copy | `constants/` or owning module |
| Value changed after deployment without rebuilding | Public runtime config loaded during bootstrap |
| User/account-specific value | API response, local workflow state, or minimal store |
| UniApp route/manifest/platform setting | Its source config such as `pages.config.*` or `manifest.config.*` |

## One Access Boundary

Use one small module to:

- Read `import.meta.env`.
- Validate required public values.
- Parse booleans and numbers once.
- Normalize URLs once.
- Export immutable, meaningfully named values.

Do not duplicate environment parsing in pages, stores, composables, API domain
modules, request interceptors, or platform adapters. The request layer imports
the normalized API base URL from config.

Preserve an existing Unibest environment directory and helper when it already
provides this boundary. Consolidate scattered reads into that owner instead of
creating a second config system.

Adapt [environment-config-template/](../assets/environment-config-template/)
only when the project has no established equivalent.

## Environment Files

- Commit an `.env.example` containing every required key with safe placeholder
  values.
- Keep local overrides and real deployment values out of version control when
  they differ per developer or contain operational details.
- Add only environment variants the project actually uses.
- Use explicit names such as `VITE_API_BASE_URL`; avoid vague names such as
  `VITE_URL`.
- Read Vite environment keys statically, such as
  `import.meta.env.VITE_API_BASE_URL`; do not use dynamic key lookup.
- Treat every `VITE_*` value as public client-bundle data.
- Keep H5 proxy settings separate from the real API base URL and mini-program
  request-domain allowlists.

## Minimal Change Rule

When touching a file that directly reads environment values:

1. Reuse the existing config boundary when present.
2. Move the affected raw reads and parsing into that boundary.
3. Replace affected callers with normalized config imports.
4. Remove superseded aliases, duplicate parsing, and fallback values.
5. Do not sweep unrelated modules unless the task is an explicit config
   consolidation.

## Validation

- Search for remaining `import.meta.env` reads outside the config boundary.
- Verify required-value failures are clear.
- Build H5 and `mp-weixin` using each affected environment.
- Confirm production bundles do not contain Mock-only code or secrets.
- Confirm H5 proxy and mini-program request-domain behavior separately.
