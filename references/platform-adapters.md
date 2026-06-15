# H5 And WeChat Platform Adapters

## Core Rule

Use a narrow adapter by default for platform/provider-sensitive capabilities
whose implementation, result, permission, or lifecycle differs. Split by
capability, not by platform and not by screen. Let the page coordinate simple
use or an optional focused service coordinate a reused multi-step workflow.

Do not wrap every `uni.*` call. When an API is already portable, has the same
contract on supported targets, and needs no policy boundary, call it directly
from its natural owner.

```text
adapters/<capability>.ts          # Stable types and port
platform/h5/<capability>.ts       # H5 implementation
platform/mp-weixin/<capability>.ts# WeChat implementation
services/<use-case>.ts            # Optional reused multi-step orchestration
composables/<workflow>.ts         # Optional complex/reused reactive workflow
```

Do not create `platformService.ts` containing login, payment, share, upload,
storage, navigation, and system information.

## Capability Ownership

| Capability | Port returns | Workflow owner handles | UI owns |
|---|---|---|---|
| Auth code/login entry | Provider credential or redirect result | Backend exchange, account policy | Trigger, pending/error display |
| Payment | Provider payment result | Order validation and confirmation | Confirm/cancel intent, pending display |
| Share | Normalized share payload/result | Share policy and content | Share entry action |
| Upload | Normalized file/progress/result | Attachment rules and persistence | Selection, progress, retry |
| Storage | Typed value operations | What is persisted and invalidated | Nothing |
| System UI | Navbar/safe-area measurements | Nothing | Layout/rendering |
| Permission | Capability permission result | Whether feature may continue | Explanation and settings action |

Platform adapters must not import Pinia, page components, Wot UI, route
guards, or business APIs.

## Result Contract

Normalize platform callback differences into typed results or typed errors. Do
not expose raw `errMsg` parsing throughout the application.

Adapt [capability-port.ts](../assets/platform-adapter-template/capability-port.ts)
as the shared result model. Add capability-specific payloads in separate files
when they become non-trivial.

Use the independent contracts in
[ports/](../assets/platform-adapter-template/ports/) as starting points. Copy
only required ports; do not merge them into one capability facade.

Provider implementations for OAuth/login, payment, share, and upload are
intentionally not supplied as universal code templates: their backend contracts,
provider credentials, callback routes, privacy declarations, and failure
semantics are project-specific. Implement each behind its corresponding port and
test it with the real provider flow.

Distinguish at least:

- `unsupported`: target cannot provide the capability.
- `denied`: user or system denied permission.
- `cancelled`: user cancelled an operation.
- `failed`: provider/runtime failure.

Keep raw provider details available for logging, but do not make UI logic parse
them.

## System UI And Capsule Measurements

Use one system-UI adapter for custom navbar metrics. On WeChat mini program:

- Prefer `uni.getWindowInfo()` for window, status bar, and safe-area data.
- Read `uni.getMenuButtonBoundingClientRect()` for capsule position when
  available.
- Validate on a real device because safe-area values can differ from developer
  tools.

On H5, return an explicit fallback with no capsule. Do not fabricate a WeChat
capsule or scatter platform checks inside `AppNavbar`.

Adapt
[system-ui-adapter.ts](../assets/platform-adapter-template/system-ui-adapter.ts).

## Login

- Keep H5 redirect/OAuth callback handling separate from WeChat `uni.login`.
- Pass normalized provider credentials to an auth service that exchanges them
  with the backend.
- Keep token persistence and user-store mutation in the auth domain, not in the
  platform adapter.
- Avoid concurrent login attempts; let one workflow own the pending state.
- Preserve the intended destination across login redirects/share entry.

## Payment

- Create the order through a business/API service first.
- Pass provider-ready payment parameters to the payment port.
- Treat provider success as a signal to re-query/confirm server order state.
- Keep pending state local and block duplicate submissions.
- Separate cancellation from failure.

## Upload

- Selection, validation, compression, upload, attachment persistence, and UI
  display are separate responsibilities.
- Let the adapter normalize platform file paths and upload callbacks.
- Keep progress scoped to one upload task, not a global store.
- Return task cancellation when supported and clean listeners after completion.
- Configure H5 CORS and WeChat upload-domain allowlists separately.

## Share

- Keep page share declarations near the page.
- Keep reusable content/policy creation in a service.
- Do not use share completion as a reliable business transaction signal.
- Handle share/deep-link entry parsing in one boundary.

## Storage

- Use one typed storage adapter around `uni.getStorage*`/`uni.setStorage*`.
- Namespace and version persisted records.
- Persist only durable state; never persist transient modal, loading, or upload
  progress state.
- Clear user-scoped records on logout/account switch.

## Conditional Compilation

Keep conditionals in target factory/implementation files. Business services and
components should depend on ports and remain condition-free.
