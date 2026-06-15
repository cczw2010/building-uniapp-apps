#!/usr/bin/env node

import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'audit-project-cleanup.mjs')
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'uniapp-cleanup-audit-'))

function write(relative, content) {
  const file = path.join(root, relative)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

write('src/pages/index.vue', '<script setup>const ready = true</script>\n')

let result = spawnSync(process.execPath, [script, root], { encoding: 'utf8' })
assert.equal(result.status, 0, result.stdout + result.stderr)
assert.match(result.stdout, /PASS/)

write('src/examples/demo.vue', '<script setup>console.log("demo")</script>\n')
write('src/utils/auth.legacy.js', '// backward compatibility\nexport const auth = true\n')
write('src/pages/todo.vue', '<script setup>// TODO remove placeholder\nconst ready = true</script>\n')
write('src/utils/documented.js', '/** Example: console.log("not runtime") */\nexport const ready = true\n')
write('src/utils/compat.js', '// @compat consumer=legacy-h5\nexport const ready = true\n')

result = spawnSync(process.execPath, [script, root], { encoding: 'utf8' })
assert.equal(result.status, 0, result.stdout + result.stderr)
assert.match(result.stdout, /template\/example/)
assert.match(result.stdout, /legacy\/backup/)
assert.match(result.stdout, /compatibility/)
assert.match(result.stdout, /marker/)
assert.match(result.stdout, /debug/)
assert.match(result.stdout, /compatibility metadata/)
assert.doesNotMatch(result.stdout, /documented\.js/)
assert.match(result.stdout, /no files were deleted/)

console.log('PASS: cleanup audit reports candidates without deleting files')
