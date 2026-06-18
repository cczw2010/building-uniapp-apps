# Coding And Comment Conventions

## Language Selection

When the user does not specify a language:

1. Preserve the existing repository and local-folder language.
2. For a new mixed-language project, prefer JavaScript for page SFC
   orchestration and simple presentation components.
3. Use TypeScript for shared contracts, API DTOs, real cross-platform adapters,
   stores, reusable libraries, and behavior whose input/output ambiguity creates
   real risk.
4. Do not mix `.js` and `.ts` versions of the same responsibility.
5. Do not convert working code solely for style consistency.

The goal is simple pages with strong shared boundaries, not maximum TypeScript
coverage or maximum JavaScript usage.

## Naming

- Name constants by meaning, not by type.
- Name booleans with `is`, `has`, `can`, or `should`.
- Name event handlers by user intent, such as `handleSubmit` or
  `handleRetry`.
- Name API modules by domain, optional services by multi-step use case, and
  adapters by capability.
- Avoid vague buckets such as `common`, `helper`, `misc`, or `data`.

## Comment Principles

Comments explain **why**, constraints, ownership, and non-obvious behavior.
Code explains **what**.

Comment:

- Business constants whose value or source is not obvious.
- Compatibility decisions and narrow platform differences.
- Race-condition prevention, idempotency, retry, and stale-response handling.
- Non-obvious lifecycle/order requirements.
- Generated-file ownership and configuration caveats.
- Important page sections when a long template is difficult to scan.

Do not comment:

- Obvious assignments, imports, getters, or one-line handlers.
- Every variable or method.
- Markup already clear from semantic component names.
- Dead code or outdated implementation history.

## Comment Formats

Use a short declaration comment only when needed:

```js
// Keep the last protected destination so login can resume navigation.
const redirectAfterLogin = ref('')
```

Use JSDoc/TSDoc for exported shared APIs when parameters, return behavior,
errors, side effects, or lifecycle are not obvious:

```ts
/**
 * Restores and validates the global session once per app launch.
 * Reuses the in-flight promise to prevent concurrent user fetches.
 */
export function ensureAppReady(): Promise<void>
```

Use brief template section comments only for large pages:

```vue
<!-- Primary account actions -->
```

Do not add comments that merely repeat names such as
`// User name` above `const userName`.

## Method Shape

- Keep methods focused on one intent.
- Prefer early returns over deep nesting.
- Keep page handlers as light orchestration. Call domain APIs directly for
  simple operations; move only reusable multi-step rules to services.
- Avoid callbacks that mutate several unrelated stores or UI regions.
- When behavior changes, update or delete every affected comment, JSDoc,
  example, and explanation in the same change. Never leave documentation that
  describes the previous behavior.
