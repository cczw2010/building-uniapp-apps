---
name: building-uniapp-apps
description: Use when working on UniApp Vue 3 or Unibest projects that require WeChat mini-program plus H5 compatibility, Wot UI v2, UnoCSS, tabbar/navbar routing, platform adapters, auth bootstrap, or release validation.
---

# Build UniApp Apps

Build one maintainable codebase for H5 and mini programs without pretending the
platforms are identical. Preserve the repository's package manager, conventions,
and locked UniApp dependency family.

## Token Budget

Default to this file plus target repository files. Do not read `README.md`, all
references, all assets, or examples during normal feature work.

- Page/component edit: load no reference unless a boundary question appears.
- Cross-module edit: load only the one or two matching references.
- New project/release/full review/unclear architecture: load setup or quality
  references and run the audit script.
- Search `references/` with `rg` before opening a reference.
- Inspect only the asset you are about to copy or adapt.

## Required Workflow

1. Classify scope: local owner/callers/config, boundary change, or project-level
   setup/release/review.
   For project-level work run
   `node <skill-root>/scripts/audit-uniapp-project.mjs <project-root>`.
2. Define acceptance behavior, failure states, and affected targets. Default
   new projects to `h5` plus `mp-weixin`; do not claim untested compatibility.
3. Plan boundaries only when modules cross. Keep simple page state/handlers in
   the page; add composables/services only when reuse or complexity proves it.
4. Implement the smallest coherent change. Sync affected callers, contracts,
   configs, tests, Mock data, comments, and explanations in the same change.
5. Validate proportionally:
   focused checks during implementation; affected H5/mp-weixin flows for shared,
   platform, startup, or navigation changes; full checks only for new baselines,
   release, explicit full review, or high-impact shared work.
   Bound every long command, server wait, and browser action with a timeout.

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

## Core Rules

- Do not hand-edit generated routing/type/build files.
- Keep all `@dcloudio/*` packages on one compatible family.
- New projects use Wot UI v2 (`@wot-ui/ui@^2`); do not mix with
  `wot-design-uni` v1 unless doing an explicit migration.
- Shared code uses `uni.*` or adapters, not DOM globals or browser-only storage.
- Put platform divergence at view, adapter, or config boundaries; avoid business
  logic `#ifdef` scatter.
- Prefer JavaScript in page SFCs when unspecified; use TypeScript for shared
  contracts, adapters, stores, and complex libraries.
- Gate protected entry on completed auth bootstrap. Keep optional permissions
  local to their features.
- Stores hold durable cross-page facts only. Loading/error/form state is local.
- Domain API modules stay simple; Mock is transparent in the request layer.
- Public environment values live in environment files and one config module.
- Use intent comments for constraints and non-obvious logic, not obvious code.
- Keep `width: 100%` page/root containers. Normalize designs to 750rpx and write
  product sizes in `rpx`; keep system px, safe areas, percentages, viewport
  units, and hairlines as explicit exceptions.
- Extract page-private components beside their page when useful; promote to
  global only after stable reuse.
- Preserve native navigation/tabbar unless product requirements justify custom.
- For Unibest tabbar, preserve `NO_TABBAR`/`NATIVE_TABBAR`/`CUSTOM_TABBAR`;
  change only the selected strategy and matching list, then regenerate/restart.
- Runtime/browser/dev-server validation must be bounded and focused on the
  changed flow. Retry a stalled step at most once with a concrete reason.

## Reference Routing

Open a reference only when the task hits its trigger:

| Trigger | Read |
|---|---|
| Dependency/version question or latest docs | [versions-and-sources.md](references/versions-and-sources.md) |
| New project or generated-file ownership | [project-setup.md](references/project-setup.md) |
| Broad module layout or shared-library boundary | [architecture.md](references/architecture.md) |
| Public environment values | [environment-configuration.md](references/environment-configuration.md) |
| API module or automatic Mock behavior | [api-and-mock.md](references/api-and-mock.md) |
| Auth bootstrap or protected app entry | [global-business-architecture.md](references/global-business-architecture.md) |
| Store, page state, composable, or event boundary | [state-and-event-boundaries.md](references/state-and-event-boundaries.md) |
| Language, naming, or comment convention | [coding-conventions.md](references/coding-conventions.md) |
| Stack-specific UI units, Wot UI, UnoCSS, 750rpx | [stack-guide.md](references/stack-guide.md) |
| Component extraction or common component inventory | [component-system.md](references/component-system.md), then [component-catalog.md](references/component-catalog.md) only if needed |
| Tabbar, navbar, safe area, route sync | [navigation-and-tabbar.md](references/navigation-and-tabbar.md) |
| Mini-program lifecycle or authorization basics | [mini-program-basics.md](references/mini-program-basics.md) |
| Platform/provider capability difference | [platform-adapters.md](references/platform-adapters.md), then [cross-platform.md](references/cross-platform.md) only if needed |
| Focused validation or stalled command | [validation.md](references/validation.md) |
| Release, full dual-target check, or cleanup audit | [dual-target-validation.md](references/dual-target-validation.md), [cleanup-and-replacement.md](references/cleanup-and-replacement.md) |
| Scope creep or replacement discipline | [minimal-change.md](references/minimal-change.md) |

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
