# Minimal Implementation And Change Scope

## Core Rule

Implement the smallest coherent solution that satisfies the requested behavior
and the required H5/WeChat validation. Small means limited scope and clear
ownership, not incomplete error handling.

## Before Editing

1. Identify the exact behavior and affected targets.
2. Find the existing owner and established pattern.
3. List the minimum files that must change.
4. Reuse an existing API module, composable, service, store, component, or
   adapter when it already owns the responsibility.
5. Add a new abstraction only when the current owner cannot safely contain the
   behavior.

## Abstraction Threshold

Create a shared abstraction only when one is true:

- It isolates a real platform difference.
- It enforces a critical application-wide policy.
- It has at least two real consumers with the same stable contract.
- It makes concurrency, cancellation, or state ownership substantially safer.

Do not create abstractions for possible future reuse, one-line wrappers, naming
preferences, or to make a small change appear architecturally complete.

## Change Discipline

- Preserve existing public APIs unless the request requires a change.
- Do not rename, move, format, or refactor unrelated files.
- Do not add a new library when an existing dependency or small local function
  solves the problem.
- Do not create a store, event bus, generic base class, plugin system, or
  platform facade without demonstrated need.
- Do not move simple page handlers/state into a composable merely to shorten the
  page. Extract a page-private component when the problem is template
  readability; extract a composable only when the reactive workflow itself is
  complex or genuinely reused.
- Do not create a service that only forwards one API call.
- Prefer one focused change followed by validation over a broad rewrite.
- If existing architecture is imperfect but not blocking the request, note the
  risk and leave it unchanged.

## Affected-Surface Synchronization

For every behavior change, inspect the related surface before and after editing:

- Callers, consumers, imports, exports, types, and public contracts
- Routes, manifest/pages config, environment keys, feature flags, and generated
  source inputs
- API handlers, request/response mapping, Mock handlers, and fixtures
- Tests, validation commands, comments, examples, and behavior explanations

Update or remove every affected item in the same change. Search for old names,
old behavior, and old wording after editing. When an affected file is generated,
change its source owner and regenerate it.

This is an impact check, not permission for unrelated cleanup. Stop at the real
dependency and behavior boundary.

When the requested change replaces an internal implementation, remove the old
implementation within the same affected scope. Keeping both old and new paths
is not a smaller change; it creates duplicate behavior and future cleanup work.
See [cleanup-and-replacement.md](cleanup-and-replacement.md).

## Completion Check

- Does every changed file directly support the requested behavior?
- Is each new module required now?
- Could any stored state be derived or remain local?
- Could an explicit return value replace an event?
- Did the change preserve existing project language and patterns?
- Are callers, contracts, config, tests, Mock data, comments, and explanations
  synchronized with the changed behavior?
- Were H5 and WeChat behavior validated only where affected?
