# Versions And Sources

## Purpose

Use this file for dependency selection and upgrades. Query live primary sources
when a task depends on current versions; do not preserve a static “latest”
snapshot in the skill.

## Version Policy

1. Inspect the lockfile and generated template first.
2. Keep every `@dcloudio/*` dependency aligned to the same release family.
3. Prefer the versions selected by the current Unibest/UniApp template over
   globally latest Vue, Vite, or TypeScript.
4. Treat DCloud special tags as release-family identifiers; do not infer
   stability or compatibility from a generic semver label.
5. For new projects, specify Wot UI v2 with `@wot-ui/ui@^2`; query the registry
   for the current v2 minor/patch. Treat `wot-design-uni` as v1 and never mix
   the two packages.
6. Upgrade in a dedicated change. Build all supported targets before and after.
7. Read changelogs and migration guides; do not use `npm update` as a migration
   strategy.

## Primary Sources

- UniApp docs: <https://uniapp.dcloud.net.cn/>
- UniApp platform conditionals:
  <https://uniapp.dcloud.net.cn/tutorial/platform.html>
- UniApp page styling, 750-wide baseline, and `rpx`:
  <https://uniapp.dcloud.net.cn/tutorial/syntax-css.html>
- UniApp GitHub: <https://github.com/dcloudio/uni-app>
- Unibest docs: <https://unibest.tech/>
- Unibest tabbar guide: <https://unibest.tech/base/2-tabbar>
- Unibest GitHub: <https://github.com/feige996/unibest>
- Wot UI v2 docs: <https://wot-ui.cn/>
- Wot UI v2 quick start: <https://wot-ui.cn/guide/quick-use.html>
- Wot UI v1-to-v2 migration:
  <https://wot-ui.cn/guide/migration-v2.html>
- UniApp pages, navbar, tabbar, easycom, and subpackage configuration:
  <https://uniapp.dcloud.net.cn/collocation/pages.html>
- UniApp built-in components: <https://uniapp.dcloud.net.cn/component/>
- UniApp system and window information:
  <https://uniapp.dcloud.net.cn/api/system/info.html>
- UniApp menu-button/capsule measurements:
  <https://uniapp.dcloud.net.cn/api/ui/menuButton.html>
- UniApp login API: <https://uniapp.dcloud.net.cn/api/plugins/login.html>
- UniApp upload/download API:
  <https://uniapp.dcloud.net.cn/api/request/network-file.html>
- UnoCSS docs: <https://unocss.dev/>
- UnoCSS Vite integration: <https://unocss.dev/integrations/vite>
- Uni Helper GitHub: <https://github.com/uni-helper>
- Reference skill reviewed for scope:
  <https://www.skills.sh/youlaitech/youlai-skills/uniapp>

Use npm registry queries for an exact current package version:

```bash
npm view create-unibest version
npm view @wot-ui/ui version
npm view unocss version
npm view @dcloudio/uni-app dist-tags --json
```
