# Global Business Architecture

## Global Means Application-Wide

Create global business modules only for behavior required across most protected
routes or needed before application entry:

- Session restoration and authentication
- Current-user summary, roles, and application-level authorization
- Environment/config initialization
- Request client/token binding
- Route access policy
- Theme, locale, feature flags, and app version/update policy

Do not make ordinary feature data, page forms, uploads, modal state, or optional
device permissions global.

## Startup Pipeline

Use one idempotent, single-flight bootstrap coordinator:

```text
app launch
  -> load public config
  -> restore token/session
  -> validate/refresh session when present
  -> load minimal current-user summary and global permissions
  -> mark bootstrap ready
  -> allow protected route or redirect to login
```

Pages must not independently restore tokens or fetch the current user during
startup. Route guards and pages await the same bootstrap promise.

Build-time public environment values are normalized synchronously by the shared
config module. Load public runtime config in this pipeline only when values must
change after deployment without rebuilding.

Adapt [app-bootstrap.ts](../assets/global-business-template/app-bootstrap.ts).

## Authentication Gate

Model global session state explicitly:

```text
unknown -> guest | authenticated | blocked
```

- `unknown`: bootstrap has not completed; protected UI must not render.
- `guest`: no valid session; redirect protected routes to login.
- `authenticated`: valid session and minimal user summary available.
- `blocked`: authenticated identity cannot enter due to a global business rule,
  such as disabled account or mandatory organization selection.

Do not treat transient network failure as confirmed guest. Present a retryable
bootstrap error instead of clearing a potentially valid session immediately.

## Authorization Levels

Separate:

1. **Authentication**: is there a valid session?
2. **Application authorization**: may this user enter/use a protected route?
3. **Feature authorization**: may this user perform a business action?
4. **Device permission**: may this feature use location, camera, album, etc.?

Only authentication and explicit application-level business policy may gate the
whole protected application. Device permission denial gates only the relevant
feature.

## Prevent Async User Races

- Expose one `ensureReady()` bootstrap promise.
- Deduplicate session refresh and current-user requests.
- Do not let request interceptors, pages, and stores trigger separate refresh
  requests concurrently.
- If no restorable session exists, finish bootstrap as guest without requesting
  the current user.
- Apply account/session updates atomically: token and user summary must describe
  the same session.
- Ignore stale responses after logout/account switch.
- Clear user-scoped state before publishing the new account.

## Route Policy

- Maintain an explicit public-route allowlist: login, callback, privacy,
  maintenance, and intentionally public pages.
- Await bootstrap before resolving protected navigation.
- Preserve the intended destination through login where safe.
- Prevent login redirect loops and repeated route replacement.
- Keep route guards declarative; call auth/application services rather than
  embedding provider APIs or user-fetch logic.

Global auth/application services are justified because they coordinate
application-wide startup and session policy. Do not generalize this exception
into a mandatory service layer for ordinary domain API calls.

## Minimal Session Store

Store only:

- Session status
- Token/session reference when client storage is required
- Minimal current-user summary
- Global roles/permissions required across routes

Derive `isAuthenticated`, role checks, display name, and similar values. Keep
login form state, bootstrap promise, redirect intent, request errors, and
feature-specific permissions outside the store.

Adapt [session-store.ts](../assets/global-business-template/session-store.ts).

## Other Global Business Modules

Add only when the whole app genuinely needs them:

| Module | Responsibility |
|---|---|
| Request client | Headers, session injection, refresh coordination, normalized errors |
| App config | Validated public runtime/build configuration |
| Feature flags | Stable global capability switches |
| Update policy | App/mini-program update notification and enforcement |
| Analytics/error reporting | Cross-cutting observability without business state |

Each global module needs one owner, a narrow interface, and no UI rendering.
