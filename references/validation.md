# Debugging And Validation

## Validation Scope Gate

Run the repository's actual scripts. Do not invent commands when scripts differ,
and do not run every available command by default.

| Scope | Required validation |
|---|---|
| Local page/component/style change | Changed-file lint/format if supported, focused tests, and affected page/state on the affected target |
| API/store/composable/adapter change | Focused owner/consumer tests plus affected workflow; add the second target only when shared behavior can differ |
| Shared startup/auth/navigation/config/platform change | Focused tests and the affected flow on H5 plus target mini program |
| New-project baseline, release, explicit full review, or high-impact shared change | Full relevant lint/type/tests/builds plus selected runtime/release flows |

Batch a coherent implementation before validating it. Do not run a full
lint/type/test/build/browser matrix after each file edit.

## Bounded Execution

Every command or tool call that may wait must have an explicit timeout or
bounded polling plan. Use repository history and known baseline durations when
available; otherwise start with these defaults:

| Operation | Initial bound |
|---|---|
| Focused lint/test/script | 2 minutes |
| Typecheck or target build | 5 minutes |
| Dev-server readiness | 90 seconds |
| One browser navigation/action/assertion | 30 seconds |

- A timeout means **unverified**, not passed and not automatically failed.
  Capture the last useful logs and identify whether the cause is startup,
  dependency installation, build, browser automation, or application behavior.
- Retry a stalled operation at most once and only after a diagnosis, narrower
  scope, configuration change, or increased bound justified by a known normal
  duration. Never repeat an identical hung command.
- Prefer a focused test file, changed package, or affected target over a whole
  repository command during implementation.
- Do not start a watcher for checks that have a one-shot command.

## Runtime And Browser Checks

- Run runtime/browser checks only when visual behavior, interaction, routing,
  lifecycle, or runtime integration is affected.
- Reuse a healthy existing server when its ownership is clear. Otherwise start
  the dev server in a controllable background/PTTY session, wait for one
  explicit readiness signal, inspect the changed route and states, then stop
  the session.
- Never run `dev:*` or another watcher as a blocking foreground validation
  command. Do not leave servers, browser sessions, or polling loops running
  after verification.
- Inspect only the affected page, workflow, viewport, and states. Compare
  another project or broad visual baseline only when the request or acceptance
  criteria require it.
- If server readiness or browser automation times out, stop it, preserve useful
  logs/screenshots when available, continue with narrower static/build checks,
  and report the runtime check as unverified.

## Full Verification Ladder

Use this ladder only for new-project baselines, releases, explicit full reviews,
or high-impact shared changes:

1. Install with the lockfile and pinned package manager when dependencies need
   installation.
2. Run formatting/lint checks.
3. Run TypeScript/type checks.
4. Run unit tests.
5. Build H5 and every promised mini-program target.
6. Open only selected primary workflows in H5 and the vendor developer tool.
7. Use a real device for affected device/provider capabilities.

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
6. Re-run the focused reproduction and affected checks. Escalate to the full
   target matrix only when the change or release scope requires it.

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
- Focused checks and affected target builds pass for the current change.
- The affected workflow is manually verified only on impacted targets; shared
  cross-target behavior is checked on H5 plus the target mini program.
- For release or explicit full review, builds pass for every claimed target and
  selected primary workflows are manually verified.
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
