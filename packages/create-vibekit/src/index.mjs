#!/usr/bin/env node
/**
 * create-vibekit - Create a VibeKit project in seconds
 * 
 * Usage:
 *   npx create-vibekit my-app
 *   npx create-vibekit my-app --template weapp
 *   npx create-vibekit my-app --template alipay
 */

import { existsSync, mkdirSync, writeFileSync, cpSync, readFileSync } from 'fs'
import { join, resolve } from 'path'
import { execSync } from 'child_process'

const TEMPLATE_BASE = 'https://raw.githubusercontent.com/liangfuliang541-pixel/uniadapter/main/packages/vibekit-template'

const TEMPLATES = {
  weapp: { label: '微信小程序', platform: 'weapp' },
  alipay: { label: '支付宝小程序', platform: 'alipay' },
  h5: { label: 'H5 / 移动端网页', platform: 'h5' },
  douyin: { label: '抖音小程序', platform: 'douyin' }
}

async function downloadTemplate(template, targetDir) {
  console.log(`\n  📦 Downloading VibeKit template (${TEMPLATES[template].label})...`)
  
  const files = [
    'package.json', 'vite.config.ts',
    'src/app.ts', 'src/app.scss', 'src/app.config.ts',
    'src/pages/index.ts', 'src/pages/index.config.ts',
    'src/pages/demo/index.ts', 'src/pages/demo/index.config.ts',
    'README.md'
  ]

  mkdirSync(targetDir, { recursive: true })
  mkdirSync(join(targetDir, 'src', 'pages', 'demo'), { recursive: true })

  // Try GitHub raw first, fallback to npm package
  for (const file of files) {
    const url = `${TEMPLATE_BASE}/${file}`
    try {
      const res = await fetch(url)
      if (res.ok) {
        const content = await res.text()
        const filePath = join(targetDir, file)
        writeFileSync(filePath, content)
        console.log(`  ✅ ${file}`)
      } else {
        throw new Error(`HTTP ${res.status}`)
      }
    } catch {
      // Fallback: copy from local template if available
      const localPath = join(process.cwd(), 'packages', 'vibekit-template', file)
      if (existsSync(localPath)) {
        const content = readFileSync(localPath, 'utf8')
        const filePath = join(targetDir, file)
        writeFileSync(filePath, content)
        console.log(`  ✅ ${file} (local)`)
      } else {
        console.log(`  ⚠️  ${file} (skipped)`)
      }
    }
  }
}

function updatePackageJson(targetDir, projectName, platform) {
  const pkgPath = join(targetDir, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
  pkg.name = projectName
  pkg.description = `VibeKit - ${TEMPLATES[platform].label} 项目`
  
  // Update platform-specific config
  if (platform === 'h5') {
    pkg.devDependencies['@tarojs/webpack5-runner'] = undefined
  }
  
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

function initGit(targetDir) {
  console.log('\n  🔧 Initializing Git...')
  try {
    execSync('git init', { cwd: targetDir, stdio: 'ignore' })
    execSync('git add .', { cwd: targetDir, stdio: 'ignore' })
    execSync('git commit -m "feat: initialize VibeKit project"', { cwd: targetDir, stdio: 'ignore' })
    console.log('  ✅ Git initialized')
  } catch {
    console.log('  ⚠️  Git init skipped (not available)')
  }
}

async function main() {
  const args = process.argv.slice(2)
  const nameArg = args.find(a => !a.startsWith('--'))
  const templateArg = args.find(a => a.startsWith('--template='))
  
  const projectName = nameArg || 'my-vibe-app'
  const template = templateArg 
    ? templateArg.split('=')[1] 
    : 'weapp'

  if (!TEMPLATES[template]) {
    console.error(`\n  ❌ Unknown template: ${template}`)
    console.error(`  Available: ${Object.keys(TEMPLATES).join(', ')}`)
    process.exit(1)
  }

  const targetDir = resolve(projectName)

  if (existsSync(targetDir)) {
    console.error(`\n  ❌ Directory "${projectName}" already exists`)
    process.exit(1)
  }

  console.log('')
  console.log('  ╔══════════════════════════════════════╗')
  console.log('  ║     VibeKit - Create New Project    ║')
  console.log('  ╚══════════════════════════════════════╝')
  console.log(`\n  Project: ${projectName}`)
  console.log(`  Template: ${TEMPLATES[template].label} (${template})`)

  await downloadTemplate(template, targetDir)
  updatePackageJson(targetDir, projectName, template)
  initGit(targetDir)

  console.log('\n  ╔══════════════════════════════════════╗')
  console.log('  ║           ✅ Project Ready!           ║')
  console.log('  ╚══════════════════════════════════════╝')
  console.log(`\n  cd ${projectName}`)
  console.log('  npm install')
  console.log('  npm run dev:weapp')
  console.log('')
  console.log('  📖 Next steps:')
  console.log('  1. Get your API key from https://openrouter.ai/keys')
  console.log('  2. Create .env: VITE_OPENROUTER_API_KEY=sk-or-...')
  console.log('  3. Run the dev command above')
  console.log('')
}

main().catch(err => {
  console.error('\n  ❌ Error:', err.message)
  process.exit(1)
})
