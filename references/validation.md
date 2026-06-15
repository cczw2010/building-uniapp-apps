# Debugging And Validation

## Verification Ladder

Run the repository's actual scripts. Do not invent commands when scripts differ.

1. Install with the lockfile and pinned package manager.
2. Run formatting/lint checks.
3. Run TypeScript/type checks.
4. Run unit tests for pure utilities, services, stores, and adapters.
5. Build H5.
6. Build every promised mini-program target.
7. Open H5 and the vendor developer tool; verify the changed workflow.
8. Use a real device for camera, location, Bluetooth, payment, login, share,
   keyboard, safe area, and performance-sensitive flows.

Typical Unibest/UniApp script names may resemble:

```bash
pnpm lint
pnpm type-check
pnpm dev:h5
pnpm build:h5
pnpm dev:mp-weixin
pnpm build:mp-weixin
```

Read `package.json`; do not assume these exact names exist.

When changing this skill's audit behavior, run its focused self-test:

```bash
node scripts/test-audit-uniapp-project.mjs
node scripts/test-audit-project-cleanup.mjs
```

## Debugging Order

1. Reproduce on one exact target with exact steps.
2. Classify: compile, configuration, runtime, network, permission, rendering,
   lifecycle, or package-size issue.
3. Compare generated target output and developer-tool console/network panels.
4. Reduce to the smallest platform boundary.
5. Fix shared code when the cause is shared; otherwise isolate the target fix.
6. Re-run the full target matrix.

## Common Failure Patterns

- H5 works, mini program fails: DOM-only dependency, request-domain settings,
  unsupported CSS, dynamic UnoCSS class, or lifecycle mismatch.
- Components unresolved: resolver/easycom/config mismatch or generated files
  stale.
- Wot UI migration fails: v1/v2 installations are mixed, a v1 import or
  easycom path remains, or a renamed v1 component/API was not migrated.
- Styles absent: UnoCSS extraction/import/plugin-order issue.
- Routing incorrect: generated route source edited incorrectly or pages config
  stale.
- Random auth failures: concurrent refresh race, cookie assumptions, or platform
  login code mixed into shared request code.
- Upgrade explosion: mismatched `@dcloudio/*`, Vite, Vue, or plugin families.

## Release Readiness

Before publishing H5 or submitting a mini program:

- Run both structural and cleanup audits; review findings instead of blindly
  fixing or deleting.
- Build with production environment values and confirm no secrets, Mock-only
  code, debug logs, demo routes, or stale compatibility paths ship.
- Verify app ID, version/build number, request/upload/download domains, privacy
  declarations, permissions, subpackages, and main-package size.
- Smoke-test startup, auth, navigation/tabbar, primary transaction, error/retry,
  account switch/logout, share/deep link, and update behavior.
- Verify H5 public base, route refresh/fallback, CORS, caching, and source-map
  policy; verify the mini program in developer tools and on a real device.

## Definition Of Done

- No unexplained warnings or type errors.
- Builds pass for every claimed target.
- Primary workflow manually verified on H5 and target mini program.
- Loading, empty, error, retry, offline/timeout, and permission-denial states
  handled where relevant.
- Platform-specific behavior isolated and documented.
- Affected callers, contracts, configuration, tests, Mock data, comments, and
  explanations match the final behavior.
- Superseded internal implementation paths and unrequired compatibility code
  removed.
- Environment-dependent public configuration is normalized through one config
  boundary, with no affected business module reading `import.meta.env`
  directly.
- Project-completion cleanup candidates reviewed and confirmed dead items
  removed.
- Unverified device/platform risk stated explicitly.
