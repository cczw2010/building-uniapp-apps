#!/usr/bin/env node

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'audit-uniapp-project.mjs')
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'uniapp-audit-'))

function write(relative, content) {
  const file = path.join(root, relative)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

write('package.json', JSON.stringify({
  dependencies: {
    '@dcloudio/uni-app': '3.0.0-1',
    '@dcloudio/uni-h5': '3.0.0-1',
  },
}))
write('pnpm-lock.yaml', 'lockfileVersion: 9\n')
write('manifest.config.ts', 'export default {}\n')
write('pages.config.ts', 'export default {}\n')
write('src/platform/mp-weixin/auth.ts', `// #ifdef MP-WEIXIN
export const login = () => uni.login({})
const menu = uni.getMenuButtonBoundingClientRect()
const native = wx.getSystemInfoSync()
// #endif
`)
write('src/platform/h5/browser.ts', `// #ifdef H5
export const visible = document.visibilityState
// #endif
`)
write('src/utils/updateManager.wx.ts', 'export const supported = wx.canIUse("getUpdateManager")\n')
write('src/hooks/comment.ts', '// wx.chooseImage is deprecated; use uni.chooseMedia\n')
write('src/api/request.js', 'export const request = options => uni.request(options)\n')
write('src/http/http.ts', 'export const request = options => uni.request(options)\n')
write('src/mock/user.js', 'export default {}\n')
write('src/config/env.js', 'export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL\n')

let result = spawnSync(process.execPath, [script, root], { encoding: 'utf8' })
assert.equal(result.status, 0, result.stdout + result.stderr)
assert.match(result.stdout, /PASS/)

write('package.json', JSON.stringify({
  dependencies: {
    '@dcloudio/uni-app': '3.0.0-1',
    '@dcloudio/uni-h5': '3.0.0-1',
    '@wot-ui/ui': '^2.0.0',
    'wot-design-uni': '^1.14.0',
  },
}))
result = spawnSync(process.execPath, [script, root], { encoding: 'utf8' })
assert.equal(result.status, 1, result.stdout + result.stderr)
assert.match(result.stdout, /Wot UI v1 and v2 installations are mixed/)

write('package.json', JSON.stringify({
  dependencies: {
    '@dcloudio/uni-app': '3.0.0-1',
    '@dcloudio/uni-h5': '3.0.0-1',
    '@wot-ui/ui': '^2.0.0',
  },
}))
write('src/uni_modules/wot-ui/package.json', '{"name":"wot-ui"}\n')
result = spawnSync(process.execPath, [script, root], { encoding: 'utf8' })
assert.equal(result.status, 1, result.stdout + result.stderr)
assert.match(result.stdout, /Wot UI v2 is installed through npm and uni_modules/)
fs.rmSync(path.join(root, 'src/uni_modules'), { recursive: true })

write('src/components/LegacyToast.vue', `<script setup>
import { useToast } from 'wot-design-uni'
</script>
`)
result = spawnSync(process.execPath, [script, root], { encoding: 'utf8' })
assert.equal(result.status, 1, result.stdout + result.stderr)
assert.match(result.stdout, /Wot UI v1 reference remains in a v2 project/)
fs.rmSync(path.join(root, 'src/components/LegacyToast.vue'))

write('src/components/LegacyDialog.vue', '<template><wd-message-box /></template>\n')
result = spawnSync(process.execPath, [script, root], { encoding: 'utf8' })
assert.equal(result.status, 1, result.stdout + result.stderr)
assert.match(result.stdout, /Wot UI v1 component or API remains in a v2 project/)
fs.rmSync(path.join(root, 'src/components/LegacyDialog.vue'))

write('src/pages.json', JSON.stringify({
  easycom: {
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
    },
  },
}))
result = spawnSync(process.execPath, [script, root], { encoding: 'utf8' })
assert.equal(result.status, 1, result.stdout + result.stderr)
assert.match(result.stdout, /Wot UI v1 reference remains in a v2 project/)
fs.rmSync(path.join(root, 'src/pages.json'))

write('src/composables/useLocalMessage.ts', `
export type FormRules = Record<string, unknown>
export function useMessage() {
  return { show: () => undefined }
}
`)

write('src/pages/login.vue', `<script setup lang="ts">
uni.login({})
uni.$emit('logged-in')
const native = wx.getSystemInfoSync()
</script>
`)
write('src/stores/session.ts', 'export const notify = () => uni.showToast({ title: "done" })\n')
write('src/pages/orders.vue', `const result = uni.request({ url: '/orders' })
const useMock = import.meta.env.VITE_USE_MOCK
const publicCdn = import.meta.env.VITE_PUBLIC_CDN_BASE_URL
`)

result = spawnSync(process.execPath, [script, root], { encoding: 'utf8' })
assert.equal(result.status, 0, result.stdout + result.stderr)
assert.match(result.stdout, /direct login capability call/)
assert.match(result.stdout, /global event bus usage/)
assert.match(result.stdout, /wx\.\* API used outside an MP-WEIXIN conditional/)
assert.match(result.stdout, /store performs navigation or UI feedback/)
assert.match(result.stdout, /direct uni\.request call/)
assert.match(result.stdout, /Mock branching\/import leaked/)
assert.match(result.stdout, /environment access leaked outside the config boundary/)

console.log('PASS: audit detects boundary violations without flagging isolated adapters')
