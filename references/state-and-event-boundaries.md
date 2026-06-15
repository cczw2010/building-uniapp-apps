# State And Event Boundaries

## One Owner Per State

Every state value must have one owner:

| State kind | Owner |
|---|---|
| Input/modal/tab selection local to one component | Component |
| Page loading/form/workflow state | Page by default; composable only when substantial complexity justifies separation |
| Durable cross-page app/user state | Pinia store |
| Server entity/cache | API/query layer or owning feature |
| Provider/device capability execution | Adapter task/result, not global state |

Other modules observe through props, returned refs, selectors, or typed results.
Do not copy and manually synchronize the same source of truth.

## Async State Model

Avoid conflicting booleans:

```ts
type AsyncStatus = 'idle' | 'pending' | 'success' | 'error' | 'cancelled'
```

Keep `status`, `data`, and `error` together in the workflow owner. Adapt
[async-action.ts](../assets/platform-adapter-template/async-action.ts) for local
login, payment, upload, permission, and submit workflows.

Do not put generic async action state in a global store. Create an instance per
workflow.

## Store Creation Test

Create or extend a Pinia store only when the state:

1. Must be read or changed by multiple unrelated pages/features.
2. Has a stable global/domain owner.
3. Must survive navigation or be restored across launches.

If none apply, keep it in the page. Use a composable only when a substantial
reactive workflow needs an independent owner or is genuinely reused. Prefer
derived/computed values over duplicated store fields. Avoid stores that only
proxy one API call.

## Event Direction

```text
user event -> component emit -> page/composable intent
           -> domain API or optional service -> adapter/API result
           -> composable state -> props/render
```

Keep events moving through explicit ownership boundaries. Do not make adapters
emit UI events or make components listen directly to provider callbacks.

## Allowed Communication

- Props down; typed emits up.
- Composable returns state and intent methods to its owning page/component.
- Domain API methods return normalized request results. Optional service methods
  coordinate reusable multi-step workflows.
- Store actions update durable shared state.
- Adapter methods return capability results and optional scoped task handles.

## Avoid

- Global event bus for login completion, upload progress, request errors,
  tabbar selection, or modal control.
- Store actions that open dialogs, navigate, or show toasts.
- Components directly changing unrelated stores.
- Platform adapters importing stores or business APIs.
- Multiple watchers synchronizing duplicated state.
- Boolean flag combinations that allow impossible states.

## Cross-Module Events

When a truly cross-cutting event is unavoidable:

1. Name the owning domain.
2. Define one typed payload.
3. Document publisher and subscribers.
4. Subscribe/unsubscribe in lifecycle-safe locations.
5. Make delivery idempotent when repeated events are possible.
6. Prefer store state or an explicit callback when either has a natural owner.

## Review Questions

- Who owns this state?
- Can it be derived rather than stored?
- Does this event cross a boundary because the boundary is wrong?
- Can a returned promise/result replace the event?
- Can the UI render from one discriminated status?
- Will logout, page unload, retry, cancellation, or H5 refresh leave stale state?
