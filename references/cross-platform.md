# Cross-Platform Development

## Shared-First Rule

Implement the common path with Vue and `uni.*` APIs. Introduce divergence only
when platform capability or UX genuinely differs.

Use the WeChat mini-program 750-wide visual baseline and `rpx` for shared
product design dimensions. Keep system-measured `px`, safe-area expressions,
percentages, and viewport units as explicit cross-platform exceptions.

## Where To Put Divergence

Prefer, in order:

1. Configuration differences in manifest/pages config.
2. A platform adapter with a shared typed interface.
3. A narrow conditional around one view/API implementation.
4. Separate platform files only for substantial implementations.

Avoid long conditionals inside stores, business services, and request code.

## Common Differences

| Area | H5 | Mini program |
|---|---|---|
| Global objects | Browser DOM may exist | No normal `window`/`document` |
| Navigation | URL/history behavior | Page stack and route limits |
| Storage/cookies | Browser policies apply | Platform storage; cookies may differ |
| Networking | CORS/proxy applies | Request-domain allowlist applies |
| Login/payment | Web OAuth/payment flow | Platform login/payment APIs |
| Upload/download | Browser behavior | Platform APIs and permissions |
| CSS | Broad browser support | Selector/property/runtime limits |
| Debugging | Browser devtools | Vendor developer tools and real device |

## Conditionals

Use official UniApp conditional syntax and current platform identifiers. Keep
blocks small and explain capability differences, not obvious syntax.

```ts
// #ifdef H5
export const paymentAdapter = createH5PaymentAdapter()
// #endif

// #ifdef MP-WEIXIN
export const paymentAdapter = createWechatMiniProgramPaymentAdapter()
// #endif
```

Do not hide type errors by assuming only one conditional branch matters. Build
each supported target.

## Compatibility Checklist

- Navigation and back behavior
- Authentication, token refresh, and account switching
- Request domains, CORS, proxy, cookies, and headers
- Authorization denial and recovery
- Image selection, upload, download, and preview
- Share behavior and deep links
- Keyboard, scroll, popup, safe area, and tab bar
- Long lists, package size, startup performance
- Dark mode, font/icon assets, and dynamic classes
