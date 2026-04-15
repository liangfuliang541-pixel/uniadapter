#!/usr/bin/env node
/**
 * uniadapter template - VibeHub page template CLI
 * 
 * Usage:
 *   uniadapter template list
 *   uniadapter template add login
 *   uniadapter template preview home
 */

import { readFileSync, existsSync, cpSync, mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = join(__dirname, '../../templates')
const MANIFEST_PATH = join(TEMPLATES_DIR, 'manifest.json')

interface Template {
  id: string
  name: string
  description: string
  platforms: string[]
  category: string
  difficulty: string
}

interface Manifest {
  name: string
  templates: Template[]
}

function loadManifest(): Manifest {
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'))
}

function listTemplates(manifest: Manifest) {
  console.log('\n  🎨 VibeHub - UniAdapter Page Templates')
  console.log('  ' + '─'.repeat(52))
  console.log('  📦 Total: ' + manifest.templates.length + ' templates\n')

  const categories: Record<string, Template[]> = {}
  for (const t of manifest.templates) {
    if (!categories[t.category]) categories[t.category] = []
    categories[t.category].push(t)
  }

  const catNames: Record<string, string> = {
    auth: '🔐 认证登录',
    commerce: '🛒 电商交易',
    user: '👤 用户中心',
    discovery: '🔍 搜索发现',
  }

  for (const [cat, items] of Object.entries(categories)) {
    console.log(`  ${catNames[cat] || cat}`)
    for (const t of items) {
      const pf = t.platforms.join('/')
      const diff = t.difficulty === 'easy' ? '🟢' : '🟡'
      console.log(`    ${diff} ${t.id.padEnd(16)} ${t.name}`)
      console.log(`      ${' '.repeat(17)}${t.description}`)
      console.log(`      ${' '.repeat(17)}Platforms: ${pf}`)
    }
    console.log('')
  }

  console.log('  Usage:')
  console.log('    uniadapter template add <name>     # Add template to project')
  console.log('    uniadapter template preview <name> # Preview in browser')
  console.log('')
}

function addTemplate(manifest: Manifest, name: string) {
  const tmpl = manifest.templates.find(t => t.id === name)
  if (!tmpl) {
    console.error(`  ❌ Template "${name}" not found. Run "uniadapter template list".`)
    process.exit(1)
  }

  const srcPath = join(TEMPLATES_DIR, `${name}.tsx`)
  if (!existsSync(srcPath)) {
    console.error(`  ❌ Template file missing: ${srcPath}`)
    process.exit(1)
  }

  const destDir = join(process.cwd(), 'src/pages', name)
  mkdirSync(destDir, { recursive: true })

  const destPath = join(destDir, 'index.tsx')
  const content = readFileSync(srcPath, 'utf-8')
  writeFileSync(destPath, content)

  // Create config
  const configPath = join(destDir, 'index.config.ts')
  writeFileSync(configPath, `export default {\n  navigationBarTitleText: '${tmpl.name}',\n}\n`)

  console.log(`\n  ✅ Template "${tmpl.name}" added!`)
  console.log(`  📁 ${destPath}`)
  console.log('\n  Next steps:')
  console.log(`  1. Import in your page:`)
  console.log(`     import ${name.replace(/-/g, '').replace(/^./, c => c.toUpperCase())}Page from '../pages/${name}/index'`)
  console.log(`  2. Add to src/app.config.ts: pages array`)
  console.log(`  3. Run: npm run dev:weapp`)
  console.log('')
}

function previewTemplate(manifest: Manifest, name: string) {
  const tmpl = manifest.templates.find(t => t.id === name)
  if (!tmpl) {
    console.error(`  ❌ Template "${name}" not found.`)
    process.exit(1)
  }

  // Generate a simple standalone HTML preview
  const htmlPath = join(TEMPLATES_DIR, `${name}.preview.html`)
  
  const previewHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${tmpl.name} - VibeHub Preview</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; }
  .preview-banner { background: linear-gradient(135deg, #07c160, #10b981); color: white; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; }
  .preview-title { font-size: 16px; font-weight: 600; }
  .preview-badge { background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 12px; font-size: 12px; }
  .preview-iframe { width: 100%; height: calc(100vh - 52px); border: none; background: #fff; }
  .device-frame { max-width: 430px; margin: 0 auto; border: 8px solid #1a1a1a; border-radius: 32px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
  @media (min-width: 860px) { .device-frame { margin-top: 20px; } }
  @media (max-width: 860px) { .device-frame { border: none; border-radius: 0; } }
</style>
</head>
<body>
<div class="preview-banner">
  <span class="preview-title">🎨 ${tmpl.name} Preview</span>
  <span class="preview-badge">VibeHub by @liangfu/uniadapter</span>
</div>
<div class="device-frame">
  <iframe class="preview-iframe" src="https://uniblock.app/vibehub/preview/${name}" />
</div>
</body>
</html>`

  writeFileSync(htmlPath, previewHtml)
  const absPath = join(process.cwd(), htmlPath)
  
  try {
    execSync(`start "" "${absPath}"`, { shell: 'cmd.exe' })
    console.log(`\n  🌐 Preview opened: ${absPath}\n`)
  } catch {
    console.log(`\n  🌐 Preview file: ${absPath}\n`)
  }
}

async function main() {
  const [, , action, name] = process.argv

  if (!action || action === 'list') {
    listTemplates(loadManifest())
    return
  }

  const manifest = loadManifest()

  if (action === 'add') {
    if (!name) {
      console.error('\n  ❌ Usage: uniadapter template add <name>')
      console.error('  Run "uniadapter template list" to see available templates.\n')
      process.exit(1)
    }
    addTemplate(manifest, name)
    return
  }

  if (action === 'preview') {
    if (!name) {
      console.error('\n  ❌ Usage: uniadapter template preview <name>\n')
      process.exit(1)
    }
    previewTemplate(manifest, name)
    return
  }

  console.error(`\n  ❌ Unknown action: ${action}`)
  console.error('  Available: list, add, preview\n')
  process.exit(1)
}

main().catch(err => {
  console.error('\n  ❌ Error:', err.message)
  process.exit(1)
})
