# H5 And WeChat Validation Matrix

Claim H5 plus WeChat compatibility only after completing relevant rows.

| Area | H5 verification | WeChat developer tool | WeChat real device |
|---|---|---|---|
| Build/startup | Production build and direct URL refresh | Compile and cold start | Cold/warm start |
| Navigation | Back/forward, refresh, deep link | Page stack, switchTab, share entry | Back gesture and app restore |
| Custom navbar | No fake capsule; responsive/safe top | Capsule alignment | Notch, font scale, real capsule |
| Custom tabbar | Refresh/visibility state sync | First click, switchTab, auth redirect | Safe bottom and app restore |
| Login | OAuth/redirect/callback path | `uni.login`, expired session | Real account and cancellation |
| Permission | Browser permission denial/recovery | API denial/settings flow | System denial and recovery |
| Upload | CORS, progress, cancel/retry | Upload domain and temp path | Camera/album, network change |
| Payment | Web payment return/cancel | Provider invocation | Real sandbox/approved payment flow |
| Share/deep link | Shared URL parsing | Share entry query | Real share card entry |
| Storage/logout | Refresh/version migration/clear | Storage and account switch | Relaunch and account switch |
| Network | CORS/proxy/offline/timeout | Request-domain allowlist | Weak network/offline/retry |
| Layout | Keyboard, viewport, long text | Popup/scroll/safe area | Keyboard, notch, font scale |

## Automated Checks

Run:

```bash
node <skill-root>/scripts/audit-uniapp-project.mjs <project-root>
```

Treat reported direct capability calls as architecture review prompts. A direct
call may be valid inside a target adapter, but it should not remain scattered
through pages, components, stores, or business services.

Run repository scripts for lint, typecheck, tests, H5 build, and
`mp-weixin` build. Use exact project script names.

## Capability Test Cases

For each capability, test:

- Success
- User cancellation
- Permission denial and recovery
- Unsupported target/environment
- Provider/runtime failure
- Duplicate trigger while pending
- Retry after failure
- Page unload or app background during operation

## Evidence In Completion Report

Record:

1. Exact H5 and `mp-weixin` build commands.
2. Screens/workflows manually exercised.
3. Developer tool versus real-device coverage.
4. Capabilities not tested with real provider credentials.
5. Remaining domain, allowlist, payment, privacy, or authorization risk.
