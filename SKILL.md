---
name: building-uniapp-apps
description: Use when creating, restructuring, debugging, reviewing, or validating UniApp Vue 3 projects that must run on mini programs and H5, especially projects using Unibest, Wot UI v2, Wot Design Uni v1, UnoCSS, custom tabbar, custom navbar, reusable components, Pinia, JavaScript or TypeScript, authentication bootstrap, file-based routing, or platform conditionals.
---

# Build UniApp Apps

Build one maintainable codebase for H5 and mini programs without pretending the
platforms are identical. Preserve the repository's package manager, conventions,
and locked UniApp dependency family.

## Required Workflow

1. Classify scope before editing:
   - For a local page/component fix, inspect only the owner, callers, and
     affected configuration.
   - For a new project, structural review/refactor, shared infrastructure,
     platform capability, or release, inspect package/config/generated-file
     ownership and run
     `node <skill-root>/scripts/audit-uniapp-project.mjs <project-root>`.
     Resolve `<skill-root>` to the directory containing this `SKILL.md`.
2. Define acceptance behavior, failure states, and affected targets. Default
   new projects to `h5` plus `mp-weixin`; never claim compatibility with an
   untested target.
3. Plan boundaries only when the change crosses modules. Keep pages thin,
   stores minimal, requests in domain API modules, and platform-sensitive
   capabilities behind narrow adapters. Keep simple page state/behavior in the
   page; add a composable or service only when complexity or reuse proves it.
4. Implement the smallest coherent change using existing patterns. Consolidate
   affected public environment values through the existing config boundary.
   Synchronize every affected caller, contract, config, test, Mock, comment, and
   explanation in the same change.
5. Validate proportionally:
   - During implementation, run only focused checks for the changed behavior,
     its callers/contracts, and affected target. Batch coherent edits before
     validation; do not run the full suite after every modification.
   - Shared/platform/startup/navigation change: focused checks plus affected H5
     and mini-program flows.
   - New-project baseline, release, explicit full review, or high-impact shared
     change: full lint/type/tests/build/runtime/release checks.
   Bound every potentially long-running command, server wait, and browser action
   with a timeout and stop condition. Report what was actually verified,
   timed out, skipped, and remaining risk.

## Choose The Path

| Situation | Action |
|---|---|
| New general project | Prefer current `create-unibest`; inspect its generated choices before customizing |
| Existing Unibest project | Preserve file routing, layouts, auto-imports, and generated-file boundaries |
| UI work | For new projects use Wot UI v2 (`@wot-ui/ui@^2`); preserve existing Wot Design Uni v1 unless migration is explicitly requested |
| Visual/layout work | Keep page/root width at `100%`; normalize design art to a 750rpx coordinate system and use `rpx` for product dimensions |
| Page-only UI section | Keep it beside the owning page as a private component; promote only after stable reuse appears |
| Tabbar/navbar work | Preserve the selected native/custom strategy and verify safe-area plus route synchronization |
| Platform/provider capability | Use a narrow adapter by default when implementations or results differ; do not wrap already-portable APIs without a boundary need |
| Global auth/startup | Use one bootstrap coordinator and one minimal session store; never let pages race to initialize user state |
| Public shared configuration | Automatically extract environment-dependent public values behind one validated config module; keep stable constants and secrets elsewhere |
| API/mock work | Keep domain API modules simple; inject deterministic development mocks only through the shared request layer |
| Replacement/refactor | Replace the old internal approach directly; retain compatibility code only when explicitly required or externally consumed |
| Review/release | Follow the requested review scope; run structural/cleanup audits, all target builds, selected real-device flows, and release checks only for release or explicit full review |

## Non-Negotiable Rules

- Treat `pages.json`, generated route/type files, and build output according to
  repository ownership comments; do not hand-edit generated files.
- Keep all `@dcloudio/*` packages on the same compatible release family. Do not
  independently upgrade one package or normalize DCloud's special version tags.
- Use Wot UI v2 (`@wot-ui/ui@^2`) for new projects. Treat `wot-design-uni` as
  Wot UI v1; never mix v1 and v2 packages, import paths, component APIs, or
  configuration. Migrate v1 only as an explicit breaking migration.
- Never use `window`, `document`, DOM-only libraries, or browser storage in
  shared code. Use `uni.*` APIs or a platform adapter.
- Never scatter `#ifdef` blocks through business logic. Put platform divergence
  at view, adapter, or configuration boundaries.
- Never create a giant platform service or global event bus. Split platform
  ports by capability and keep state/events with one clear owner.
- When the user does not specify a language, preserve the repository language.
  For a new mixed-language project, prefer JavaScript in page SFCs and
  TypeScript at shared contracts, adapters, stores, and complex library
  boundaries. Never rewrite working files only to change language.
- Gate protected application entry on completed authentication bootstrap.
  Optional device permissions such as camera or location gate only their
  feature, not the whole application.
- Keep stores minimal: store durable cross-page facts, derive everything else,
  and keep transient loading/error/form state local.
- Keep simple page state and handlers in the page. Create a composable only for
  complex reusable reactive behavior, lifecycle coordination, or a page that
  clearly benefits from separating a substantial workflow.
- Comment intent, constraints, and non-obvious decisions. Do not comment obvious
  assignments, markup, or every variable.
- Every behavior change requires an affected-surface check. Update or remove all
  related callers, exports/types, configuration, routes, tests, Mock data,
  comments, and explanations in the same change; do not leave stale parallel
  descriptions or behavior.
- Make the smallest change that solves the requested behavior. Remove the
  superseded internal path in the same change; do not add speculative layers or
  preserve compatibility unless explicitly required.
- Do not create a service layer by default. Pages or composables may call domain
  API modules directly; add a service only for a reused multi-API workflow or
  substantial business transformation.
- Do not expose Mock switches to pages, stores, composables, or API modules.
  Match Mock handlers transparently inside the shared request layer and fall
  through to the real network when unmatched.
- Do not put secrets in `VITE_*` variables; they are bundled into clients.
- When creating or touching environment-dependent public configuration, place
  its raw value in the existing environment files and expose it through one
  config module. Pages, stores, composables, domain APIs, and adapters must not
  read `import.meta.env` directly.
- Do not assume H5 success proves mini-program success. Validate every affected
  or promised target according to the scope gate.
- Never wait indefinitely for validation, a dev server, vendor tool, browser
  action, or watcher. Use an explicit bounded wait, capture useful output, stop
  the process/session when finished or stalled, and report a timeout as
  unverified rather than blocking the task.
- Do not rerun the same stalled command or browser step without a diagnosis or
  concrete change. Retry at most once with an explicit reason; otherwise use a
  narrower check or report the limitation.
- Do not open or compare unrelated projects, pages, or browser states during
  routine feature work. Runtime and visual checks must target the changed flow
  and directly affected states.
- Preserve lifecycle semantics: page lifecycle hooks are not interchangeable
  with Vue component lifecycle hooks.
- Use stable, static class names for UnoCSS. Safelist intentionally generated
  classes; do not construct arbitrary class names at runtime.
- Default frontend visual work to a 750rpx coordinate system, but keep page and
  root containers at `width: 100%`. Never set page width from the design image's
  raw pixel width.
- If a design image is not 750px wide, first scale its measurements to a 750
  baseline, then write product layout, spacing, component size, radius, icons,
  and design-scale typography in `rpx`. Do not copy screenshot `px` values into
  code.
- Do not mechanically replace platform/system measurements, safe-area values,
  viewport-relative layout, percentages, or intentional physical-pixel hairlines
  with `rpx`. Keep each exception explicit and local.
- Do not create a generic component merely because markup repeats once. Extract
  stable behavior, policy, or visual semantics with a clear owner and contract.
- Page-private components may be extracted for readability and kept beside
  their page. Do not promote them to global `components/` without stable reuse.
- Do not replace native navigation or tabbar without a concrete product need.
  Custom navigation inherits safe-area, page-stack, accessibility, and
  cross-platform responsibilities.
- For Unibest tabbar, preserve the official `NO_TABBAR`/`NATIVE_TABBAR`/
  `CUSTOM_TABBAR` strategy config. Change only the selected strategy and its
  matching list; regenerate/restart so `pages.json` reflects the config.

## Reference Routing

Read only the exact references needed:

- Foundation: [versions-and-sources.md](references/versions-and-sources.md),
  [project-setup.md](references/project-setup.md),
  [architecture.md](references/architecture.md),
  [environment-configuration.md](references/environment-configuration.md),
  [minimal-change.md](references/minimal-change.md).
- Data/global state: [api-and-mock.md](references/api-and-mock.md),
  [global-business-architecture.md](references/global-business-architecture.md),
  [state-and-event-boundaries.md](references/state-and-event-boundaries.md),
  [coding-conventions.md](references/coding-conventions.md).
- UI/navigation: [stack-guide.md](references/stack-guide.md),
  [component-system.md](references/component-system.md),
  [component-catalog.md](references/component-catalog.md),
  [navigation-and-tabbar.md](references/navigation-and-tabbar.md).
- Platform behavior: [mini-program-basics.md](references/mini-program-basics.md),
  [platform-adapters.md](references/platform-adapters.md),
  [cross-platform.md](references/cross-platform.md).
- Quality/release: [dual-target-validation.md](references/dual-target-validation.md),
  [cleanup-and-replacement.md](references/cleanup-and-replacement.md),
  [validation.md](references/validation.md).

## Completion Report

State:

1. Files and behavior changed.
2. Targets actually built and manually checked.
3. Commands run and their outcomes.
4. Any target, device API, authorization flow, or package-family risk not
   verified.

## Reusable Starting Points

Use starting points only when their responsibility is required now. Do not copy a
generic UI shell into a project before the product need and existing project
pattern are clear.

- `assets/platform-adapter-template/`: capability ports and system UI metrics.
- `assets/global-business-template/`: bootstrap and minimal session store.
- `assets/api-mock-template/`: lightweight request/API/automatic Mock shape.
- `assets/environment-config-template/`: public environment boundary.
