# Architecture

## Recommended Boundaries

Keep the generated project layout. Add a directory only with its first real
owner:

- `api/`: the first backend endpoint and shared request client.
- `config/`: the first public environment value needing normalization.
- `stores/`: the first durable cross-page state, usually session.
- `utils/`: a pure helper with a current consumer.
- `components/`, `composables/`, `adapters/`, or `services/`: only after their
  extraction gates are met.

Do not create empty architecture folders during project setup.

## Dependency Direction

Pages may call domain API modules directly and should own simple local state,
handlers, and lifecycle behavior. Use a composable only for a substantial
reactive workflow whose complexity or reuse justifies a separate owner. Add a
service only for a reused multi-API workflow or substantial business
transformation. APIs and adapters must not depend on pages or UI components.
Pure utilities must not import UniApp runtime APIs.

A composable is not a generic shared method. Put stateless transformation,
formatting, validation, and calculation functions in `utils/` or their owning
domain module. Use a composable only when Vue reactivity, lifecycle, or scoped
workflow state is essential.

Business modules must import normalized public configuration from `config/`
rather than reading `import.meta.env` directly. Keep stable business constants
in `constants/`; environment configuration is only for public values that
actually vary by environment, deployment, or target.

Use this direction only when those optional boundaries exist:

```text
page/component -> composable? -> domain API -> request client
                              -> service? -> domain APIs/adapter?
target-specific adapter -------------------------^
```

An adapter does not own business state, route policy, toasts, or UI events.

## Request Layer

Centralize:

- Base URL and headers
- Token injection and refresh policy
- Timeout, cancellation, and duplicate-submit behavior
- Business-code normalization
- Error mapping and observability
- Development-only automatic Mock matching with transparent real-network
  fallback

Do not show toasts inside low-level request code unless the repository explicitly
uses that policy. Return typed errors so the caller controls user experience.
Avoid infinite refresh loops and make concurrent refresh behavior deterministic.
Pages, stores, composables, and domain API modules must not call `uni.request`
directly or branch on Mock configuration.

## State

- Keep server data close to the page/composable unless multiple routes need it.
- Put only authenticated session facts, minimal current-user summary,
  cross-page permissions/roles, theme, locale, and truly durable app state in
  Pinia.
- Persist a minimal subset with `uni.*` storage; add a helper only when shared
  migration, expiry, versioning, or serialization policy exists.
- Clear user-scoped stores and storage on logout/account switch.
- Keep transient capability state such as upload progress, payment submission,
  permission prompt, and login attempt local to the initiating workflow.
- Do not mirror the same state in component refs, composables, and Pinia.
- Model mutually exclusive async states with one discriminated status instead
  of `isLoading`, `isError`, `isSuccess`, and `isCanceled` booleans.
- Prefer one store per stable global domain. Do not create a store for every
  page, API resource, modal, form, or async action.
- Keep actions small and deterministic. Stores must not navigate, show UI
  feedback, request device permissions, or render components.

## Events

- Component emits communicate upward user intent.
- Composable callbacks or returned promises communicate workflow completion.
- Stores communicate durable shared state through state/actions.
- Use an event bus only for a truly cross-cutting event with no natural owner;
  document publisher, subscribers, payload, and cleanup.
- Never use a global event bus for request results, tabbar selection, login
  completion, upload progress, or ordinary parent-child communication.

## Pages And Subpackages

- Keep page components focused on data loading, view state, navigation, and
  composing pieces.
- Keep page-private UI sections beside their owning page. Promote them to
  feature/shared components only after stable reuse appears.
- Put low-frequency business areas into mini-program subpackages when size or
  startup cost justifies it.
- Do not create cross-subpackage imports that break bundling assumptions.
- Measure main-package size with the target developer tool.

## Shared Library Extraction

Extract shared code only when it has a stable responsibility and at least two
real consumers, or when isolation is needed for platform variance/testing. A
page-private component may be extracted earlier only to keep a large page
readable; it stays local and may depend on that page's feature boundary.

Prefer a narrow adapter for platform/provider capabilities with real
implementation or result differences. Do not create adapters that only rename
an already-portable `uni.*` call.
