# Lightweight API And Automatic Mock

## Default Shape

Keep frontend API access simple:

```text
src/
  api/
    request.js       # Shared transport, interceptors, Mock entry
    user.js          # User-domain request functions
    order.js         # Order-domain request functions
  mock/
    index.js         # Automatic matcher
    user.js          # User-domain handlers/fixtures
    order.js         # Order-domain handlers/fixtures
```

Default call direction:

```text
page/composable -> domain API -> request -> matched Mock or real network
```

Do not add a service layer by default.

## Domain API Modules

- Split API functions by business domain, not HTTP method.
- Export small named functions such as `getUserProfile` or `createOrder`.
- Call only the shared request client.
- Keep endpoint paths, request parameters, and response contracts close.
- Do not show UI feedback, navigate, mutate stores, or branch on Mock state.
- Do not create one giant API index containing unrelated domains.
- Import normalized base URLs and public transport switches from the shared
  config module; do not read `import.meta.env` inside domain API modules.

Pages may call a domain API directly for simple fetch/create/update/delete
operations. Use a composable when multiple pages reuse loading/state behavior.

## When A Service Is Justified

Add a focused service only when at least one applies:

- One use case coordinates multiple API calls or a platform capability.
- Several pages reuse the same ordered business workflow.
- Significant business validation or transformation must remain consistent.
- Concurrency, compensation, or retry sequencing requires one owner.

Do not create a service that only renames or forwards one API function.

## Automatic Mock Rule

Mock is a development transport concern. Inject it only inside the shared
request client:

1. In development, ask the Mock matcher for `METHOD + normalized path`.
2. If matched, return a cloned/created response using the same contract as the
   real API.
3. If unmatched, automatically continue to the real network request.
4. In production, ensure the compile-time development branch is removed and
   Mock handlers are excluded from the production bundle.

Business code must not contain `if (mock)`, `VITE_USE_MOCK`, or direct Mock
imports.

The shared request layer should also consume normalized values from the config
module rather than parsing environment variables itself.

Adapt [api-mock-template/](../assets/api-mock-template/) to the repository's
request return shape.

## Handler Shape

Use deterministic values by default:

```js
export default {
  'GET /user/profile': () => ({
    code: 0,
    data: { id: 'user-1', displayName: 'Demo User' },
  }),
}
```

A handler may inspect normalized request options for pagination or filters.
Keep it small and side-effect-free. Avoid random data, timers, or hidden mutable
state unless the scenario explicitly tests them.

## Response Contract

- Mock and real responses must use the same normalized contract.
- Keep fixtures realistic but minimal.
- Include stable IDs and values to make tests reproducible.
- Simulate success, empty, business error, unauthorized, timeout, and network
  failure only when those states are needed.
- Do not mix Mock user/session data with a real protected API in one workflow.

## Lightweight Rules

- Do not introduce MSW, a local server, or a large Mock framework unless native
  browser requests outside the shared request client must be intercepted.
- Do not generate handlers for every endpoint before they are needed.
- Do not make Mock configuration a global store.
- Do not persist Mock state unless a specific workflow needs it.
- Keep unmatched requests visible in development logs when useful, but allow
  transparent real-network fallback.

## Review Checklist

- Does every page use a domain API rather than `uni.request`?
- Does every domain API use the shared request client?
- Is the Mock decision contained entirely in the request layer?
- Does an unmatched Mock reach the real backend?
- Are handlers deterministic and contract-compatible?
- Is a proposed service coordinating real business complexity?
