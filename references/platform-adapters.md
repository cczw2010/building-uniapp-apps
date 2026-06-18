# H5 And WeChat Platform Adapters

## Core Rule

Call portable `uni.*` APIs directly from their natural owner. Add an adapter
only when H5 and WeChat implementations, return values, permissions, or
lifecycle behavior actually differ.

Do not create ports, factories, provider folders, or normalized result types in
advance. Start with one function in the owning feature. Extract an adapter after
the first real platform branch appears; add a port only when multiple
implementations or consumers need a stable contract.

```text
feature/page -> uni.*                         # portable behavior
feature/page -> adapter/<capability>          # real target divergence
workflow -> adapter/<capability>              # reused multi-step behavior
```

Never create one `platformService` containing unrelated capabilities. An adapter
must not own Pinia, UI, route policy, or business APIs.

## Result Contract

Normalize errors only when callers otherwise need platform-specific parsing.
Use the smallest result shape needed by the current flow. Common distinctions
when relevant are:

- `unsupported`: target cannot provide the capability.
- `denied`: user or system denied permission.
- `cancelled`: user cancelled an operation.
- `failed`: provider/runtime failure.

## System UI And Capsule Measurements

Only custom navbar work needs a shared system-metrics boundary by default.
Adapt [system-ui-adapter.ts](../assets/platform-adapter-template/system-ui-adapter.ts)
when the project has no equivalent.

On WeChat mini program:

- Prefer `uni.getWindowInfo()` for window, status bar, and safe-area data.
- Read `uni.getMenuButtonBoundingClientRect()` for capsule position when
  available.
- Validate on a real device because safe-area values can differ from developer
  tools.

On H5, return zero/no-capsule values. Do not fabricate WeChat geometry.

## Login

- Keep H5 redirect/OAuth callback handling separate from WeChat `uni.login`.
- Pass provider credentials to the existing auth workflow for backend exchange.
- Keep token persistence and user-store mutation in the auth domain, not in the
  platform adapter.
- Avoid concurrent login attempts; let one workflow own the pending state.
- Preserve the intended destination across login redirects/share entry.

## Payment

- Create the order through the domain API first.
- Pass provider-ready parameters to the direct platform API or existing adapter.
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
- Extract reusable share content only after it repeats.
- Do not use share completion as a reliable business transaction signal.
- Handle share/deep-link entry parsing in one boundary.

## Storage

- Use `uni.getStorage*`/`uni.setStorage*` directly for simple storage.
- Add a wrapper only for reused namespacing, migration, expiry, or serialization.
- Persist only durable state; never persist transient modal, loading, or upload
  progress state.
- Clear user-scoped records on logout/account switch.

## Conditional Compilation

Keep a small target branch in the owning adapter. If there is only one local
branch, do not build a factory or platform directory around it.
