# Cleanup And Direct Replacement

## Two Different Activities

- **During feature/refactor work:** replace the old internal approach directly
  within the affected scope.
- **At project completion/release:** run a broader evidence-based cleanup pass
  for leftover template and obsolete project code.

Do not combine either activity with speculative unrelated refactors.

## Direct Replacement Is The Default

When optimizing or changing internal code:

1. Identify the current owner and all real callers.
2. Implement the new path.
3. Migrate affected callers, contracts, config, tests, Mock data, and
   explanations.
4. Remove the old path, duplicate state, old events, old config, and stale
   comments or documentation in the same change.
5. Validate affected H5 and WeChat behavior.

Do not retain:

- Legacy wrappers that only forward to the new implementation
- Dual reads/writes to old and new stores
- Old and new request clients running together
- Deprecated aliases, route fallbacks, or duplicate event names
- Feature flags whose migration has already completed
- Comments describing removed behavior

## Compatibility Exception

Keep compatibility code only when at least one is true:

- The user explicitly requests backward compatibility.
- An external consumer or released public API still depends on it.
- A staged migration or rollback window is explicitly defined.
- Persisted user data requires a migration reader.
- Multiple deployed client versions must coexist with the backend contract.

Document every retained compatibility path with:

- Consumer/reason
- Owner
- Removal condition or deadline
- Test proving the compatibility behavior

Use an explicit annotation so cleanup review can distinguish intentional
compatibility from accidental leftovers:

```js
// @compat consumer=legacy-h5 owner=auth-team removeAfter=2026-09
```

Compatibility is not justified by “it may be useful later.”

## Project-Level Cleanup Scope

Review:

- Demo/example pages, components, APIs, Mock handlers, routes, and assets
- Unselected template features and plugins
- Unused dependencies and scripts
- Stale exports/imports, constants, styles, UnoCSS shortcuts/safelist entries
- Duplicate environment reads/parsing, obsolete keys, and unused environment
  variants or fallback values
- Obsolete stores, events, adapters, request clients, and compatibility paths
- Debug logs, commented-out code, TODO/FIXME/HACK markers, and obsolete comments
- Generated files only through their source/config owner

## Evidence Before Deletion

Use several signals:

1. Search imports, route/page config, auto-import config, aliases, and dynamic
   registration.
2. Check `pages.config.*`, `pages.json`, manifest, easycom/resolvers, UnoCSS
   safelist, and conditional compilation.
3. During small cleanup groups, run focused checks and affected builds. Run
   lint/typecheck/tests and both target builds for the final project-level
   cleanup or release gate.
4. Verify the related runtime flow.
5. Delete in small groups and re-verify.

Never delete solely because a text search reports no imports. UniApp projects
contain generated routes, auto imports, convention-based components, dynamic
assets, and target-specific references.

## Cleanup Audit

Run:

```bash
node <skill-root>/scripts/audit-project-cleanup.mjs <project-root>
```

The script reports review candidates only. It never deletes files and must not
be treated as proof that code is unused.

## Cleanup Order

1. Remove confirmed unreachable routes/features.
2. Remove their pages/components/adapters/mocks/assets.
3. Remove now-unused exports, constants, styles, and dependencies.
4. Remove stale compatibility code and comments.
5. Run focused checks after each coherent group; run the full relevant suite
   once at the final cleanup/release gate.
6. Manually verify affected startup, auth, navigation, H5, and WeChat flows
   with bounded waits and controlled server/browser sessions.

## Stop Conditions

Stop and keep the candidate when:

- Ownership or runtime reference cannot be determined.
- It may be generated, auto-imported, convention-loaded, or conditionally
  compiled.
- No relevant build/runtime verification is available.
- Removing it would expand the task into unrelated architecture work.
