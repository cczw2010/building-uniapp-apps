# Component System

## Decide Before Extracting

Extract a component when at least one is true:

- It owns stable reusable behavior, such as upload, permission gating, or
  pagination state.
- It expresses a product-wide visual semantic, such as page shell, empty state,
  or section header.
- It isolates a platform difference behind one typed contract.
- Two or more real consumers need the same API and behavior.

Do not extract one-off markup, page-specific orchestration, or a thin wrapper
that only renames Wot UI v2 props.

For a large page, extracting a private visual section for readability is
allowed without claiming reuse. Keep it colocated with the page, give it a
narrow props/emits contract, and do not move it into global components.

## Component Layers

| Layer | Responsibility | May depend on |
|---|---|---|
| `base/` | Product primitives: page shell, app navbar, app icon, safe area | Vue, Uni APIs/adapters, theme |
| `feedback/` | Loading, empty, error, skeleton, retry composition | Base components, Wot UI v2 |
| `form/` | Product-specific field behavior: upload, verification, region | Base, Wot UI v2, adapters |
| `navigation/` | Custom tabbar, page tabs, permission-aware links | Router/page stack adapters |
| `business/` | Reusable domain presentation and interactions | Services/types for its domain |
| page-local | One page or feature only | Anything inside that feature boundary |

Do not create a global `common/` dumping ground. Move a component to a shared
layer only after its responsibility and consumers are clear.

Typical page-local placement:

```text
src/pages/order-detail/
  index.vue
  components/
    OrderSummary.vue
    DeliverySection.vue

# If the file router scans nested page Vue files:
src/features/order-detail/components/
```

Follow the repository's existing convention and confirm page-local Vue files are
excluded from generated routes. If that cannot be confirmed, keep them in a
feature-local directory outside `pages/`. Page-local components may receive
page-specific data and actions, but should not create hidden global state or
unrelated side effects.

## Contract Rules

- Name product components with a stable prefix such as `App`, `Base`, or a
  domain name. Preserve an existing repository convention.
- Keep props serializable and explicit. Prefer semantic props such as
  `state="error"` over many loosely related booleans.
- Use typed props, emits, slots, and exposed methods.
- Keep controlled state controlled: accept `modelValue`, emit
  `update:modelValue`, and do not silently fork external state.
- Emit user intent (`retry`, `submit`, `select`) rather than leaking internal
  click details.
- Use slots for variable content; use props for policy and state.
- Avoid direct API requests or global-store imports in base/presentation
  components. Put orchestration in pages, composables, or domain containers.
- Do not mutate props or depend on undocumented Wot internal selectors.

## Styling Rules

- Build product-facing component dimensions from the 750-wide design baseline
  and use `rpx` by default. Keep device/system measurements and safe-area or
  viewport-relative values in their correct native/relative units.
- Use semantic tokens and existing UnoCSS shortcuts.
- Keep dynamic class choices in static maps so UnoCSS can extract them.
- Make root layout behavior explicit; custom components can introduce wrapper
  nodes on mini-program targets.
- Do not start from a bundled page or navbar component template. Native navbar
  and page-local layout are the default; build shared shells only from repeated
  project-specific policy.
- Use `virtualHost` only for supported targets and only when wrapper removal is
  required. Verify component styling after enabling it.
- Test long text, missing images, loading, empty, error, disabled, dark mode,
  keyboard, and safe-area states.

## Component Delivery Checklist

1. State responsibility and intended consumers.
2. Define typed props, emits, slots, and state ownership.
3. Reuse Wot UI v2 primitives where appropriate.
4. Add focused tests for behavior-heavy components.
5. Build only affected targets during implementation; build H5 and the target
   mini program when the component is shared across both or at release.
6. Manually verify only affected visual states and parent-child event behavior
   using bounded runtime/browser checks.

## Common Mistakes

| Mistake | Correction |
|---|---|
| Wrap every Wot component | Wrap only to enforce meaningful product policy or behavior |
| Component imports a page store/API | Pass data/actions or create a domain container |
| Many boolean props conflict | Replace with a small explicit state model |
| Slot API is undocumented and inconsistent | Name slots by semantic region and keep them stable |
| Shared component contains many `#ifdef` blocks | Move platform variance to an adapter or separate implementation |
