# Navigation And Tabbar

## Select The Simplest Strategy

| Strategy | Use when | Avoid when |
|---|---|---|
| No tabbar | Single-entry activity, auth flow, or focused tool | Main multi-section application |
| Native tabbar | Standard navigation, fastest first render, stable platform UX | Dynamic permissions, unusual icons/layout, center action |
| Custom tabbar | Runtime role filtering, badges, custom icons, center action, product-specific behavior | Native behavior already satisfies requirements |

For current Unibest projects, preserve its built-in strategy constants and
configuration instead of creating a second tabbar system. The current base
template supports no tabbar, native tabbar, and custom tabbar strategies.

## Custom Tabbar Invariants

- Keep tab pages in route/pages configuration even when rendering a custom
  visual tabbar.
- Use `uni.switchTab` for cached tab pages. Do not only update the selected
  index.
- Derive or resynchronize selection from the current page stack after app
  restore, H5 visibility restore, share/deep-link entry, auth interception, and
  completed navigation.
- Restore the previous selected item when navigation fails.
- Hide the native tabbar only where required by the selected target; platform
  timing differs.
- Reserve bottom safe-area space and prevent page content from being covered.
- Safelist configured UnoCSS icon classes because runtime configuration strings
  may not be extracted.
- Test role changes, badge changes, repeated current-tab clicks, back navigation,
  login redirects, and first-load flicker.

Unibest's current documentation notes that custom tabbar first-click flicker can
occur and that `custom: true` in pages configuration only applies to WeChat mini
program; H5 and App need their own rendered behavior.

## Native Tabbar Rules

- Use static page paths and supported icon assets.
- Do not promise runtime role-based tab removal; choose custom tabbar when menu
  items must change dynamically.
- Keep tabbar pages at top-level routes where required by the target.
- Verify target limits for item count, icon formats, dimensions, and package
  paths.

## Custom Navbar Decision

Keep the native navbar unless the product needs custom layout, immersive
content, special actions, or a unified branded shell. Custom navbar means the
application owns:

- Status-bar and capsule/menu-button spacing
- Title, back/home behavior, and page-stack edge cases
- Safe-area behavior, scrolling, contrast, and accessibility
- H5 behavior where the mini-program capsule does not exist

Set `navigationStyle: 'custom'` only for pages that render the replacement.
UniApp documents the normal navbar as 44px excluding status bar, but do not
hard-code total height. Read measurements through one system-info adapter.

## Navbar Contract

Prefer a controlled component:

- Props: `title`, `fixed`, `placeholder`, `transparent`, `showBack`,
  `showHome`, and measured dimensions when needed.
- Emits: `back`, `home`, and semantic action events.
- Slots: `left`, `title`, and `right`.
- Parent back policy: call `uni.navigateBack` when the stack has a previous page;
  otherwise route to the configured home page. Keep this policy outside the
  presentation component.

Keep platform measurement code outside the presentation component. Adapt
[AppNavbar.vue](../assets/component-templates/AppNavbar.vue) to the repository's
system-info helper and routing policy.

## Page Shell And Safe Areas

Use one page shell for repeated page-level policy: background, min height,
loading/empty/error state placement, top/bottom safe areas, and custom navbar
placeholder. Do not make it own business fetching.

Adapt [AppPage.vue](../assets/component-templates/AppPage.vue) instead of
duplicating page-state branching on every route.

## Verification Matrix

- First launch, tab switching, repeated tab click, and back navigation
- Deep link/share entry and auth redirect
- H5 refresh plus browser visibility restore
- Mini-program developer tool and real device
- Notched device, bottom safe area, keyboard open, and long title
- Permission-based tabs and dynamic badges
