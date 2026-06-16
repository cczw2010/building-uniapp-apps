# Navigation And Tabbar

## Select The Simplest Strategy

| Strategy | Use when | Avoid when |
|---|---|---|
| No tabbar | Single-entry activity, auth flow, or focused tool | Main multi-section application |
| Native tabbar | Standard navigation, fastest first render, stable platform UX | Dynamic permissions, unusual icons/layout, center action |
| Custom tabbar | Runtime role filtering, badges, custom icons, center action, product-specific behavior | Native behavior already satisfies requirements |

For current Unibest projects, preserve its built-in strategy constants and
configuration instead of creating a second tabbar system. The current `base`
template supports the old tabbar/spa use cases through three strategies:

| Value | Strategy | Effective config |
|---|---|---|
| `0` | `NO_TABBAR` | Neither `nativeTabbarList` nor `customTabbarList` should take effect |
| `1` | `NATIVE_TABBAR` | Only `nativeTabbarList` should drive `tabBar.list` |
| `2` | `CUSTOM_TABBAR` | Only `customTabbarList` should drive the custom UI; a simplified tabbar list still feeds page config |

Change `selectedTabbarStrategy` instead of forking route, tabbar, or store
logic. After changing strategy or tabbar lists, rerun the project command that
regenerates config/restarts the app; generated `pages.json` will not update
from an edited config file until the project is rerun.

Use Unibest's derived flags as the source of behavior:

- `tabbarCacheEnable`: true for native and custom strategies.
- `customTabbarEnable`: true only for custom strategy.
- `needHideNativeTabbar`: true only for custom strategy.
- `tabbarList`: full active list for UI/store usage.

## Custom Tabbar Invariants

- Keep tab pages in route/pages configuration even when rendering a custom
  visual tabbar.
- Use `uni.switchTab` for cached tab pages in both native and custom strategies.
  Do not only update the selected index or navigate with normal page APIs.
- Let the selected strategy decide the active list: never merge
  `nativeTabbarList` and `customTabbarList`, and do not keep a second page-local
  tabbar config.
- Derive or resynchronize selection from the current page stack after app
  restore, H5 visibility restore, share/deep-link entry, auth interception, and
  completed navigation.
- Restore the previous selected item when navigation fails.
- Hide the native tabbar only when `needHideNativeTabbar` is true. The custom
  strategy hides native chrome and renders its own UI; it is not a separate
  route system.
- Reserve bottom safe-area space and prevent page content from being covered.
- Safelist configured UnoCSS icon classes, or keep a static commented reference
  in the tabbar component, because runtime configuration strings may not be
  extracted.
- For custom `image` icons, configure both `icon` and `iconActive`. For
  `iconfont`, include the required `iconfont` class prefix. For UI-library
  icons, keep the component mapping in the global custom tabbar boundary.
- Configure center bulge or special action behavior in the tabbar store and
  global tabbar component, not inside individual pages.
- Test role changes, badge changes, repeated current-tab clicks, back navigation,
  login redirects, and first-load flicker.

Unibest's current documentation notes that custom tabbar first-click flicker is
a known limitation. Do not promise to eliminate it with extra state layers.
`tabBar.custom` in pages configuration only applies to WeChat mini program; H5
and App need their rendered behavior from the custom tabbar component.

## Native Tabbar Rules

- Use static page paths and supported icon assets.
- Do not promise runtime role-based tab removal; choose custom tabbar when menu
  items must change dynamically.
- Keep tabbar pages at top-level routes where required by the target.
- Use selected/unselected icon assets or an iconfont approach accepted by the
  target; native tabbar cannot freely render arbitrary custom UI.
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

When a custom navbar is justified, implement it from the project's current
design system instead of copying a generic bundled template. Prefer a controlled
component:

- Props: `title`, `fixed`, `placeholder`, `transparent`, `showBack`,
  `showHome`, and measured dimensions when needed.
- Emits: `back`, `home`, and semantic action events.
- Slots: `left`, `title`, and `right`.
- Parent back policy: call `uni.navigateBack` when the stack has a previous page;
  otherwise route to the configured home page. Keep this policy outside the
  presentation component.

Keep platform measurement code outside the presentation component. Use the
system-UI adapter pattern in
[system-ui-adapter.ts](../assets/platform-adapter-template/system-ui-adapter.ts)
only when the project does not already have an equivalent metrics boundary.

## Page Shell And Safe Areas

Do not create a global page shell by default. Keep simple page layout in the
page. Create a page shell only when repeated page-level policy is already clear:
background, full-width root, loading/empty/error state placement, top/bottom
safe areas, or custom-navbar placeholder. Do not make it own business fetching.
Build that shell in the project style, with root width `100%` and product
dimensions in `rpx`.

## Verification Matrix

- First launch, tab switching, repeated tab click, and back navigation
- Deep link/share entry and auth redirect
- H5 refresh plus browser visibility restore
- Mini-program developer tool and real device
- Notched device, bottom safe area, keyboard open, and long title
- Permission-based tabs and dynamic badges
