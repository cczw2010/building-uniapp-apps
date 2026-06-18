# Component System

## Default

Use Wot UI v2 directly and keep one-off UI in its page. A large page may split
visual sections into page-private components for readability; this is file
organization, not a new shared component system.

Do not create `base/`, `feedback/`, `form/`, or `navigation/` component layers
until real shared components exist for those responsibilities.

## Extraction Gate

Create a shared component only when at least one is true:

- Two real consumers need the same behavior and contract.
- Repeated product policy must remain consistent.

For readability or isolated testing, create a page-private component instead of
a shared one. Do not extract because markup repeats once or a wrapper can rename
Wot props. Prefer deletion or direct library use over a thin wrapper.

## Placement

```text
src/pages/order-detail/
  index.vue
  components/
    OrderSummary.vue
```

Follow the repository's existing convention and confirm page-local Vue files are
excluded from generated routes. Otherwise place them in the smallest existing
feature-local directory outside `pages/`. Promote to `src/components/` only
after a second real consumer needs the same contract.

## Contract

- Keep props/emits explicit and follow the repository language.
- Emit user intent (`retry`, `submit`, `select`) rather than leaking internal
  click details.
- Keep API calls, route orchestration, and global-store mutation in the owning
  page or workflow unless the component itself is the proven behavior owner.
- Do not mutate props or depend on undocumented Wot internal selectors.

## Styling Rules

- Build product-facing component dimensions from the 750-wide design baseline
  and use `rpx` by default. Keep device/system measurements and safe-area or
  viewport-relative values in their correct native/relative units.
- Use semantic tokens and existing UnoCSS shortcuts.
- Keep dynamic class choices in static maps so UnoCSS can extract them.
- Make root layout behavior explicit; custom components can introduce wrapper
  nodes on mini-program targets.
- Native navbar and page-local layout are the default. Do not create `AppPage`,
  `AppNavbar`, empty/error wrappers, or form wrappers before repeated product
  policy exists.
- Use `virtualHost` only for supported targets and only when wrapper removal is
  required. Verify component styling after enabling it.

## Check

- Can Wot UI or a native component handle it directly?
- Is the component page-private unless reuse already exists?
- Does extraction remove more complexity than it adds?
- Were only affected H5/mini-program states checked?
