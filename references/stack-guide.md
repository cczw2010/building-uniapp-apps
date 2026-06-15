# Stack Guide

## Unibest

Treat Unibest as an opinionated project template, not a runtime replacement for
UniApp. Preserve its file routing, layouts, auto-imports, environment helpers,
request conventions, and generated files when already present.

Before changing Unibest configuration, read the current relevant official page:
quick start, plugins, styles, UI selection, requests, state, builds, or upgrade
guide at <https://unibest.tech/>.

## Wot UI v2

- For new projects, use Wot UI v2 through `@wot-ui/ui@^2`. The old
  `wot-design-uni` package is Wot UI v1 and must not be selected for new work.
- Preserve an existing v1 project unless the user explicitly requests a v2
  migration. Never mix v1 and v2 packages, imports, component APIs, or config.
- Install v2 with `pnpm add @wot-ui/ui@^2`. Confirm the repository has a
  compatible Sass version; current official guidance recommends
  `sass@^1.98.0`.
- Prefer existing components for forms, feedback, overlays, navigation, lists,
  loading, and empty states.
- Read the component's current docs before using props/events/slots.
- Use the library's theme/config provider and tokens; do not globally override
  internal component selectors without a documented reason.
- Check H5 and mini-program popup layering, safe area, scrolling, and form
  behavior.
- Import/use components through the repository's configured resolver or
  `easycom` pattern. Do not mix registration strategies casually.
- For npm-installed v2, use `@wot-ui/ui/components/...` in the resolver or
  `@wot-ui/ui/components/wd-$1/wd-$1.vue` in `easycom`; use
  `@wot-ui/ui/global` for Volar global component types when required.
- Treat a v1-to-v2 upgrade as a breaking migration. Follow the official
  migration guide and synchronize affected dependencies, imports, config,
  component APIs, themes, types, tests, comments, and documentation.

## UnoCSS

- Keep `UnoCSS()` in the Vite plugin pipeline according to current UniApp/Unibest
  guidance.
- Import generated UnoCSS output exactly as configured by the template.
- Prefer static class strings. Runtime concatenation such as
  `` `text-${color}` `` may not be detected; use a static map or safelist.
- Use shortcuts for stable design primitives, not for one-off opaque bundles.
- Keep design tokens semantic and cross-platform. Confirm unsupported CSS
  features against the target mini-program.
- Inspect generated output when classes work on H5 but disappear in a mini
  program.

## JavaScript, TypeScript, And Vue

- Preserve the repository's established language. Do not mass-convert JavaScript
  to TypeScript or TypeScript to JavaScript without an explicit migration
  request.
- For a new project when language is unspecified, prefer
  `<script setup>` JavaScript for page SFC orchestration. Keep page code short
  and readable.
- Use TypeScript where a shared contract prevents real ambiguity: API DTOs,
  capability ports, adapters, stores, reusable component contracts, complex
  utilities, and library modules.
- Simple constants and utilities may use either language consistently with their
  surrounding module.
- Do not introduce TypeScript ceremony into a small page merely to type local
  booleans and event handlers.
- Validate external data at boundaries when incorrect data can break behavior.
- Use `onLoad`, `onShow`, `onHide`, pull-down, share, and other UniApp page hooks
  for page semantics; use Vue lifecycle for component semantics.
- Avoid destructuring reactive objects in ways that lose reactivity.

## Styling

### Design Baseline

- Follow the WeChat mini-program visual model by default. Create and interpret
  design drafts at `750px` width; design `1px` maps directly to code `1rpx`.
- Treat `750rpx` as the page-width baseline. Use `rpx` as the default unit for
  product layout widths/heights, spacing, padding, margins, radius, icons, and
  design-scale typography.
- When a supplied design draft is not 750px wide, convert with:
  `750 * design value / design draft width`, then use the result in `rpx`.
- Keep shared spacing, radius, typography, and component-size tokens expressed
  in `rpx` when they represent product visual scale.

### Required Unit Exceptions

- Keep platform and system measurements in the unit returned by the API,
  commonly `px`: status bar, capsule/menu button, window metrics, keyboard,
  and other device measurements. Do not relabel a measured `px` value as
  `rpx`; convert only when a component contract explicitly requires it.
- Use `env(safe-area-inset-*)`, percentages, `vh`/`vw`, and `calc()` when the
  behavior is genuinely relative to safe area, parent size, or viewport.
- Use `px` for intentional fixed physical-pixel behavior such as a hairline or
  a platform-defined fixed dimension. Document non-obvious exceptions.
- Preserve an existing project's explicit design-unit convention unless the
  user requests migration. Do not mix `px` and `rpx` arbitrarily within the
  same visual system.

### Cross-Target Styling

- Use semantic theme variables for colors and spacing.
- Do not assume every browser CSS feature or selector works in mini programs.
- Test long text, localization, dark mode, keyboard resize, and bottom safe area.
