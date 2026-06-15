# Common Component Catalog

Use this catalog to decide what to reuse, wrap, or build. First inspect existing
project components and current Wot UI v2 capabilities. For an existing v1
project, preserve its component generation until an explicit migration.

## Prefer Wot UI v2 Directly

Use existing library components directly for generic UI primitives:

| Need | Typical library category |
|---|---|
| Button, icon, image, badge, tag | Basic display |
| Cell, grid, divider, collapse | Data display |
| Input, textarea, picker, switch, radio, checkbox | Form |
| Popup, action sheet, dialog, toast, notify | Feedback/overlay |
| Tabs, pagination, load-more | Navigation/data |
| Loading, skeleton, status/empty state | Feedback |

Check current component docs before naming a specific component or relying on a
prop, event, slot, or platform capability.

## Product Base Components

| Component | Build when | Must not own |
|---|---|---|
| `AppPage` | Pages share safe areas, background, and state slots | API fetching or business store |
| `AppNavbar` | Multiple custom-navbar pages share behavior | Platform measurements hidden inside ad hoc view code |
| `AppIcon` | Product uses multiple icon sources with one semantic API | Unbounded arbitrary runtime class construction |
| `SafeAreaBottom` | Bottom-safe padding repeats outside page shell | Device/business logic |
| `SectionHeader` | Product section hierarchy repeats | Page-specific actions |

## Feedback Components

| Component | Responsibility |
|---|---|
| `PageLoading` | Initial page loading, distinct from button/inline loading |
| `PageEmpty` | Empty result with optional semantic action |
| `PageError` | Recoverable page failure with typed retry intent |
| `NetworkStatus` | Offline/degraded network message |
| `PermissionState` | Explain denied permission and recovery action |

Prefer composing library primitives. Do not fork a parallel toast/dialog system.

## Form And Capability Components

| Component | Responsibility |
|---|---|
| `UploadField` | Selection, validation, progress, retry, preview, removal |
| `VerifyCodeField` | Countdown and request state, not authentication policy |
| `RegionField` | Normalized region value and picker behavior |
| `LocationField` | Permission-aware location selection via adapter |
| `AuthButton` | Platform authorization entry with typed result |

Capability components should depend on typed adapters so H5 and mini-program
implementations can differ without leaking conditionals into forms.

## Navigation Components

| Component | Responsibility |
|---|---|
| `CustomTabbar` | Render configured items and emit navigation intent |
| `PageTabs` | In-page section switching, distinct from route tabbar |
| `PermissionLink` | Hide/disable/redirect based on explicit policy |
| `BackHomeAction` | Resolve no-history back behavior consistently |

Use Unibest's built-in tabbar implementation when present. Extend its config and
store instead of adding another `CustomTabbar`.

## Business Components

Create domain-specific components such as `OrderCard`, `UserSummary`, or
`ProductPrice` only when their domain meaning and interaction contract are
stable. Keep endpoint calls and route-level orchestration outside presentational
business components.

## Naming And Placement

```text
src/components/
  base/
  feedback/
  form/
  navigation/
src/features/<domain>/components/
src/pages/<page>/components/  # Only when excluded from file-route scanning
```

Use `src/pages/<page>/components/` for private sections extracted only for page
readability when the repository's router supports it; otherwise use a
feature-local directory outside `pages/`. Do not promote a page/feature-local
component to global scope until another consumer needs the same stable contract.
