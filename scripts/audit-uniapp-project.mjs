#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.argv[2] || process.cwd())
const findings = []

function add(level, message) {
  findings.push({ level, message })
}

function exists(relative) {
  return fs.existsSync(path.join(root, relative))
}

function readJson(relative) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'))
  } catch (error) {
    add('error', `Cannot parse ${relative}: ${error.message}`)
    return null
  }
}

function walk(directory, files = []) {
  if (!fs.existsSync(directory)) return files
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git', '.output'].includes(entry.name)) continue
    const full = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (/\.(vue|ts|js|tsx|jsx|scss|css)$/.test(entry.name)) files.push(full)
  }
  return files
}

function isBoundaryFile(relative) {
  return /(^|\/)(adapters|platform)(\/|$)/.test(relative.replaceAll('\\', '/'))
}

function isRequestBoundaryFile(relative) {
  return /(^|\/)(api\/request|request\/(?:index|request)|http\/(?:index|http)|utils\/(?:request|http))(\.[^/]+)?$/.test(relative)
}

function isMockBoundaryFile(relative) {
  return /(^|\/)(mock|mocks|config)(\/|$)/.test(relative) || isRequestBoundaryFile(relative)
}

function isEnvironmentBoundaryFile(relative) {
  return /(^|\/)config(\/|$)/.test(relative.replaceAll('\\', '/'))
}

function hasPositiveScope(scopes, platform) {
  return scopes.some(scope => scope.type === 'ifdef' && scope.platforms.includes(platform))
}

const capabilityPatterns = [
  ['login', /\buni\.login\s*\(/],
  ['payment', /\buni\.requestPayment\s*\(/],
  ['upload', /\buni\.uploadFile\s*\(/],
  ['permission', /\buni\.(authorize|openSetting|getSetting)\s*\(/],
  ['menu button metrics', /\buni\.getMenuButtonBoundingClientRect\s*\(/],
]
const storeUiSideEffectPattern = /\buni\.(navigateTo|redirectTo|reLaunch|switchTab|showToast|showModal|showActionSheet)\s*\(/

const pkg = exists('package.json') ? readJson('package.json') : null
if (!pkg) add('error', 'package.json is missing or invalid')

const locks = ['pnpm-lock.yaml', 'yarn.lock', 'package-lock.json'].filter(exists)
if (locks.length === 0) add('warn', 'No lockfile found')
if (locks.length > 1) add('warn', `Multiple lockfiles found: ${locks.join(', ')}`)

const deps = { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) }
const dcloud = Object.entries(deps).filter(([name]) => {
  return name.startsWith('@dcloudio/uni-') || name === '@dcloudio/vite-plugin-uni'
})
const families = new Set(dcloud.map(([, version]) => String(version).replace(/^[~^]/, '').split('-')[0]))
if (families.size > 1) add('warn', 'Potentially mixed @dcloudio/* release families; inspect lockfile')

const hasWotV1Package = Boolean(deps['wot-design-uni'])
const hasWotV2Package = Boolean(deps['@wot-ui/ui'])
const hasWotV1Module = exists('src/uni_modules/wot-design-uni') || exists('uni_modules/wot-design-uni')
const hasWotV2Module = exists('src/uni_modules/wot-ui') || exists('uni_modules/wot-ui')
const hasWotV1Install = hasWotV1Package || hasWotV1Module
const hasWotV2Install = hasWotV2Package || hasWotV2Module

if (hasWotV1Install && hasWotV2Install) {
  add('error', 'Wot UI v1 and v2 installations are mixed; keep one major and one installation strategy')
}
if (hasWotV1Package && hasWotV1Module) {
  add('error', 'Wot UI v1 is installed through npm and uni_modules; keep one installation strategy')
}
if (hasWotV2Package && hasWotV2Module) {
  add('error', 'Wot UI v2 is installed through npm and uni_modules; keep one installation strategy')
}

if (!exists('src/manifest.json') && !exists('src/manifest.config.ts') && !exists('manifest.json') && !exists('manifest.config.ts')) {
  add('warn', 'No manifest.json or manifest.config.ts found')
}
if (!exists('src/pages.json') && !exists('src/pages.config.ts') && !exists('pages.json') && !exists('pages.config.ts')) {
  add('warn', 'No pages.json or pages.config.ts found')
}
if (deps.unocss && !exists('uno.config.ts') && !exists('uno.config.js')) {
  add('warn', 'UnoCSS dependency found but no uno.config.ts/js found')
}

const wotV1ReferencePattern = /(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*)['"][^'"]*wot-design-uni|['"][^'"]*(?:uni_modules\/wot-design-uni|wot-design-uni\/components)[^'"]*['"]/
const wotV1ComponentApiPattern = /<wd-(?:message-box|status-tip|col-picker|number-keyboard)\b|<wd-grid-item\b[^>]*@itemclick\b|import(?:\s+type)?\s*\{[^}]*\b(?:useMessage|FormRules)\b[^}]*\}\s*from\s*['"]@wot-ui\/ui['"]|from\s*['"]@wot-ui\/ui\/components\/common\/util['"]/

function checkWotV1Residue(relative, text) {
  if (!hasWotV2Install) return
  if (wotV1ReferencePattern.test(text)) {
    add('error', `${relative}: Wot UI v1 reference remains in a v2 project`)
  }
  if (wotV1ComponentApiPattern.test(text)) {
    add('error', `${relative}: Wot UI v1 component or API remains in a v2 project`)
  }
}

for (const file of walk(path.join(root, 'src'))) {
  const text = fs.readFileSync(file, 'utf8')
  const relative = path.relative(root, file).replaceAll('\\', '/')
  checkWotV1Residue(relative, text)
  const isWechatPlatformFile = /\.wx\.[^.]+$/.test(relative)
  const scopes = []
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    const start = line.match(/^\s*\/\/\s*#(ifdef|ifndef)\s+(.+?)\s*$/)
    if (start) {
      scopes.push({
        type: start[1],
        platforms: start[2].split(/\s*\|\|\s*/),
      })
      continue
    }
    if (/^\s*\/\/\s*#endif\b/.test(line)) {
      scopes.pop()
      continue
    }

    if (/^\s*\/\//.test(line)) continue

    const lineNumber = index + 1
    if (!hasPositiveScope(scopes, 'H5') && /\b(window|document)\s*\./.test(line)) {
      add('warn', `${relative}:${index + 1}: browser DOM global used outside an H5 conditional`)
    }
    if (!hasPositiveScope(scopes, 'H5') && /\blocalStorage\s*\./.test(line)) {
      add('warn', `${relative}:${index + 1}: localStorage used outside an H5 conditional`)
    }
    if (!isWechatPlatformFile && !hasPositiveScope(scopes, 'MP-WEIXIN') && /\bwx\./.test(line)) {
      add('warn', `${relative}:${lineNumber}: wx.* API used outside an MP-WEIXIN conditional`)
    }
    if (!hasPositiveScope(scopes, 'MP-WEIXIN') && /\buni\.getMenuButtonBoundingClientRect\s*\(/.test(line)) {
      add('warn', `${relative}:${lineNumber}: WeChat menu-button API used outside an MP-WEIXIN conditional`)
    }
    if (/\buni\.\$(on|once|emit|off)\s*\(/.test(line)) {
      add('warn', `${relative}:${lineNumber}: global event bus usage requires an explicit owner and cleanup`)
    }
    if (/(^|\/)(store|stores)(\/|$)/.test(relative) && storeUiSideEffectPattern.test(line)) {
      add('warn', `${relative}:${lineNumber}: store performs navigation or UI feedback; keep stores state-focused`)
    }
    if (!isRequestBoundaryFile(relative) && /\buni\.request\s*\(/.test(line)) {
      add('warn', `${relative}:${lineNumber}: direct uni.request call; use a domain API and the shared request client`)
    }
    if (!isMockBoundaryFile(relative) && /(?:VITE_[A-Z0-9_]*MOCK|import\.meta\.env\.[A-Z0-9_]*MOCK|from\s+['"][^'"]*\/mocks?)/i.test(line)) {
      add('warn', `${relative}:${lineNumber}: Mock branching/import leaked outside the request or Mock boundary`)
    }
    if (!isEnvironmentBoundaryFile(relative) && /\bimport\.meta\.env(?:\.|\[)/.test(line)) {
      add('warn', `${relative}:${lineNumber}: environment access leaked outside the config boundary`)
    }
    if (!isBoundaryFile(relative)) {
      for (const [capability, pattern] of capabilityPatterns) {
        if (pattern.test(line)) {
          add('warn', `${relative}:${lineNumber}: direct ${capability} capability call; move it behind a narrow adapter`)
        }
      }
    }
  }
  if (/class\s*=\s*["'`][^"'`]*\$\{/.test(text)) {
    add('warn', `${relative}: dynamic class may not be extracted by UnoCSS`)
  }
}

for (const relative of [
  'pages.json',
  'src/pages.json',
  'pages.config.ts',
  'pages.config.js',
  'src/pages.config.ts',
  'src/pages.config.js',
  'vite.config.ts',
  'vite.config.js',
  'vite.config.mts',
  'tsconfig.json',
]) {
  if (exists(relative)) checkWotV1Residue(relative, fs.readFileSync(path.join(root, relative), 'utf8'))
}

const rank = { error: 0, warn: 1, info: 2 }
findings.sort((a, b) => rank[a.level] - rank[b.level] || a.message.localeCompare(b.message))

console.log(`UniApp project audit: ${root}`)
if (findings.length === 0) {
  console.log('PASS: no structural risks detected')
  process.exit(0)
}
for (const finding of findings) console.log(`${finding.level.toUpperCase()}: ${finding.message}`)
const errors = findings.filter((item) => item.level === 'error').length
const warnings = findings.filter((item) => item.level === 'warn').length
console.log(`Summary: ${errors} error(s), ${warnings} warning(s)`)
process.exit(errors ? 1 : 0)
