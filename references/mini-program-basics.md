# Mini-Program Basics

## Page And Component Semantics

- Use UniApp page lifecycle hooks for route/page behavior and Vue hooks for
  component behavior.
- Treat page stack as the source of navigation truth. Normalize route paths
  before comparisons.
- Keep tab pages, normal pages, redirects, relaunches, and back navigation
  semantically distinct.
- Do not assume a component root behaves exactly like an H5 DOM node. Verify
  wrapper layout and events on the target mini program.
- Use supported event modifiers carefully; verify touch, scroll, and overlay
  behavior in the vendor developer tool.

## Components

- Register components through the repository's established `easycom`, resolver,
  or explicit import approach. Do not mix strategies without need.
- Keep props/emits compatible with mini-program serialization boundaries.
- Avoid passing large mutable objects through deep component trees; use explicit
  state ownership.
- Use `virtualHost` only where supported and needed to remove wrapper-layout
  effects.
- Keep selectors and CSS within target-supported limits.

## Authorization And Device Capabilities

Create typed adapters for login, profile, phone number, location, camera,
album/file selection, upload, payment, share, and subscription messages.

For every capability:

1. Detect availability.
2. Request permission only at a user-initiated moment.
3. Handle denial, cancellation, and settings recovery.
4. Return a typed result to the caller.
5. Verify on a real device.

Do not treat authorization success as permanent.

## Sharing And Entry

- Parse and validate launch/share query data at one boundary.
- Handle unauthenticated share entry without losing the destination.
- Re-synchronize custom tabbar and navigation after share/deep-link entry.
- Keep share configuration close to the page while sharing policy stays in a
  reusable helper when common.

## Packages And Performance

- Keep startup-critical pages and assets in the main package.
- Move low-frequency feature areas into subpackages when target limits or startup
  performance justify it.
- Do not create illegal cross-subpackage dependencies.
- Configure preload intentionally; H5 does not support mini-program subpackages
  in the same way.
- Measure package size, first render, list performance, and image behavior in the
  target developer tool and on device.

## Small-Program Checklist

- App ID, request/upload/download domain allowlists, and privacy declarations
- Page registration, tabbar paths, subpackages, and preload rules
- Login, permissions, share, payment, upload, and denied-state recovery
- Startup, background/foreground restore, page stack, and account switch
- Safe areas, capsule/navbar, keyboard, scroll, popup, and tabbar overlays
- Developer tool build plus real-device verification

