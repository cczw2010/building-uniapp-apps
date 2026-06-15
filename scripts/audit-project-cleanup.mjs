#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.argv[2] || process.cwd())
const findings = []

function add(category, relative, detail) {
  findings.push({ category, relative, detail })
}

function walk(directory, files = []) {
  if (!fs.existsSync(directory)) return files

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git', '.output', 'unpackage'].includes(entry.name)) continue
    const full = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else files.push(full)
  }

  return files
}

const sourceFiles = walk(path.join(root, 'src'))

for (const file of sourceFiles) {
  const relative = path.relative(root, file).replaceAll('\\', '/')
  const basename = path.basename(relative).toLowerCase()

  if (/(^|\/)(demo|demos|example|examples|sample|samples)(\/|$)/i.test(relative)) {
    add('template/example', relative, 'review whether this generated/template example is still required')
  }

  if (/\.(bak|backup|old|orig|tmp)$/i.test(basename) || /(?:^|[._-])(copy|backup|legacy|deprecated)(?:[._-]|$)/i.test(basename)) {
    add('legacy/backup', relative, 'review whether this backup or legacy-named file should be removed')
  }

  if (!/\.(vue|ts|js|tsx|jsx|scss|css|json)$/.test(file)) continue

  const text = fs.readFileSync(file, 'utf8')
  let inBlockComment = false
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    const lineNumber = index + 1
    const trimmed = line.trim()

    if (inBlockComment) {
      if (trimmed.includes('*/')) inBlockComment = false
      continue
    }
    if (trimmed.startsWith('/*')) {
      if (!trimmed.includes('*/')) inBlockComment = true
      continue
    }

    if (/\b(TODO|FIXME|HACK|XXX)\b/.test(line)) {
      add('marker', `${relative}:${lineNumber}`, line.trim())
    }
    if (/\b(console\.log|debugger)\b/.test(line) && !/^\s*(\/\/|<!--)/.test(line)) {
      add('debug', `${relative}:${lineNumber}`, line.trim())
    }
    if (/\b(legacy|deprecated|backward.?compat|compatibility|兼容旧|旧版兼容)\b/i.test(line)) {
      add('compatibility', `${relative}:${lineNumber}`, line.trim())
    }
    if (/@compat\b/.test(line) && !/\bowner=\S+/.test(line)) {
      add('compatibility metadata', `${relative}:${lineNumber}`, '@compat requires owner=...')
    }
    if (/@compat\b/.test(line) && !/\b(removeAfter|removeWhen)=\S+/.test(line)) {
      add('compatibility metadata', `${relative}:${lineNumber}`, '@compat requires removeAfter=... or removeWhen=...')
    }
  }
}

findings.sort((a, b) => a.category.localeCompare(b.category) || a.relative.localeCompare(b.relative))

console.log(`Project cleanup audit: ${root}`)
if (findings.length === 0) {
  console.log('PASS: no obvious cleanup review candidates detected')
  process.exit(0)
}

for (const finding of findings) {
  console.log(`REVIEW [${finding.category}] ${finding.relative}: ${finding.detail}`)
}
console.log(`Summary: ${findings.length} review candidate(s); no files were deleted`)
