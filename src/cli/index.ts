#!/usr/bin/env node
/**
 * UniAdapter CLI - VibeUI 组件添加工具
 *
 * 使用方式：
 *   npx @liangfu/uniadapter add button card dialog toast
 *   npx @liangfu/uniadapter add --all
 *   npx @liangfu/uniadapter add --platform weapp button
 *   npx @liangfu/uniadapter list
 *   npx @liangfu/uniadapter init
 */

import { VibeUI, type ComponentName, type ComponentPlatform } from '../components/registry/index.ts'
import * as fs from 'fs'
import * as path from 'path'

// ── 终端颜色 ────────────────────────────────────────────────────────────────

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
}

function log(msg: string, color = 'reset') {
  console.log(`${(colors as any)[color]}${msg}${(colors as any).reset}`)
}

function success(msg: string) { log(`✅ ${msg}`, 'green') }
function info(msg: string) { log(`ℹ️  ${msg}`, 'blue') }
function warn(msg: string) { log(`⚠️  ${msg}`, 'yellow') }
function error(msg: string) { log(`❌ ${msg}`, 'red') }

// ── 命令解析 ────────────────────────────────────────────────────────────────

const [,, command, ...args] = process.argv

const vibeui = new VibeUI()

async function main() {
  if (!command) {
    printHelp()
    return
  }

  switch (command) {
    case 'add':
    case 'a': {
      await handleAdd(args)
      break
    }

    case 'list':
    case 'ls': {
      handleList(args)
      break
    }

    case 'init': {
      await handleInit(args)
      break
    }

    case 'preset': {
      handlePreset()
      break
    }

    case 'search':
    case 's': {
      handleSearch(args)
      break
    }

    case 'help':
    case '--help':
    case '-h': {
      printHelp()
      break
    }

    case 'template':
    case 'tpl': {
      await handleTemplate(args)
      break
    }
    default: {
      error(`未知命令: ${command}`)
      printHelp()
      process.exit(1)
    }
  }
}

function printHelp() {
  log(`
${colors.bold}UniAdapter VibeUI CLI${colors.reset}

${colors.bold}用法:${colors.reset}
  npx @liangfu/uniadapter add <组件名...>   添加组件
  npx @liangfu/uniadapter add --all         添加所有组件
  npx @liangfu/uniadapter add --preset       添加推荐组件包
  npx @liangfu/uniadapter list              列出所有组件
  npx @liangfu/uniadapter list --category feedback   按分类列出
  npx @liangfu/uniadapter search <关键词>    搜索组件
  npx @liangfu/uniadapter init              初始化项目配置

${colors.bold}选项:${colors.reset}
  --platform <平台>    指定目标平台 (weapp/alipay/douyin/h5)
  --ts                 使用 TypeScript (默认)
  --no-styles          不生成样式文件

${colors.bold}示例:${colors.reset}
  npx @liangfu/uniadapter add button card dialog toast
  npx @liangfu/uniadapter add --platform weapp button input
  npx @liangfu/uniadapter list --category feedback
  npx @liangfu/uniadapter search "弹窗"
  npx @liangfu/uniadapter init
`)
}

// ── add 命令 ────────────────────────────────────────────────────────────────

async function handleAdd(args: string[]) {
  const flags = {
    platform: 'weapp' as ComponentPlatform,
    all: false,
    preset: false,
    typescript: true,
    withStyles: true,
  }

  const components: string[] = []

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--platform' && args[i + 1]) {
      flags.platform = args[++i] as ComponentPlatform
    } else if (arg === '--all') {
      flags.all = true
    } else if (arg === '--preset') {
      flags.preset = true
    } else if (arg === '--no-styles') {
      flags.withStyles = false
    } else if (arg === '--no-ts') {
      flags.typescript = false
    } else if (!arg.startsWith('--')) {
      components.push(arg)
    }
  }

  const platformLabel: Record<ComponentPlatform, string> = {
    h5: 'Web/H5', weapp: '微信小程序', alipay: '支付宝小程序',
    douyin: '抖音小程序', xiaohongshu: '小红书', amap: '高德地图',
    reactnative: 'React Native',
  }

  if (flags.all) {
    info(`添加全部组件到 ${platformLabel[flags.platform]}...`)
  } else if (flags.preset) {
    info(`添加推荐组件包到 ${platformLabel[flags.platform]}...`)
  } else if (components.length > 0) {
    info(`添加 ${components.join(', ')} 到 ${platformLabel[flags.platform]}...`)
  } else {
    error('请指定要添加的组件名称，或使用 --all / --preset')
    process.exit(1)
  }

  // 确定要添加的组件列表
  const names: ComponentName[] = flags.all
    ? vibeui.getPreset()
    : flags.preset
      ? vibeui.getPreset()
      : components as ComponentName[]

  const unknown = names.filter(n => !vibeui.has(n))
  if (unknown.length > 0) {
    warn(`未知组件: ${unknown.join(', ')}`)
    const known = names.filter(n => vibeui.has(n))
    if (known.length === 0) {
      error('没有有效的组件名称')
      process.exit(1)
    }
    warn(`将添加以下已知组件: ${known.join(', ')}`)
  }

  const validNames = names.filter(n => vibeui.has(n))

  // 输出目录
  const outDir = path.join(process.cwd(), 'src', 'components')

  // 生成源代码
  const sources = vibeui.generate(validNames, flags.platform, {
    outDir: 'src/components',
    withStyles: flags.withStyles,
    typescript: flags.typescript,
  })

  // 写入文件
  let written = 0
  let skipped = 0

  for (const [name, source] of sources) {
    const componentDir = path.join(outDir, name)
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true })
    }

    for (const file of source.files) {
      const filePath = path.join(componentDir, path.basename(file.path))

      if (fs.existsSync(filePath) && !file.path.includes('.json')) {
        // 跳过已存在的文件（用户可能已定制）
        skipped++
        continue
      }

      fs.writeFileSync(filePath, file.content, 'utf8')
      info(`创建: ${path.relative(process.cwd(), filePath)}`)
      written++
    }
  }

  // 生成 index.ts 入口
  const indexPath = path.join(outDir, 'index.ts')
  const indexContent = validNames
    .map(n => `export { ${capitalize(n)} } from './${n}/index'`)
    .join('\n')
  fs.writeFileSync(indexPath, indexContent, 'utf8')
  info(`更新: ${path.relative(process.cwd(), indexPath)}`)

  // 总结
  log(`\n${'─'.repeat(50)}`)
  success(`完成！已添加 ${validNames.length} 个组件到 ${platformLabel[flags.platform]}`)
  if (written > 0) info(`新建 ${written} 个文件`)
  if (skipped > 0) warn(`跳过 ${skipped} 个已存在的文件`)
  log(`\n现在可以在代码中直接使用：`)
  for (const name of validNames) {
    log(`  import { ${capitalize(name)} } from './components/${name}'`, 'gray')
  }
}

// ── list 命令 ────────────────────────────────────────────────────────────────

function handleList(args: string[]) {
  const category = args.includes('--category')
    ? args[args.indexOf('--category') + 1] as any
    : undefined

  const components = vibeui.list(category)
  const categoryLabel: Record<string, string> = {
    form: '表单', layout: '布局', feedback: '反馈', navigation: '导航', data: '数据', media: '媒体',
  }

  log(`\n${colors.bold}VibeUI 组件注册表 (${components.length} 个)${colors.reset}\n`)

  const byCategory = new Map<string, typeof components>()
  for (const c of components) {
    if (!byCategory.has(c.category)) byCategory.set(c.category, [])
    byCategory.get(c.category)!.push(c)
  }

  for (const [cat, items] of byCategory) {
    log(`${colors.bold}[${categoryLabel[cat] || cat}]${colors.reset}`)
    for (const item of items) {
      const stars = item.popularity ? `${'⭐'.repeat(Math.min(5, Math.floor((item.popularity || 0) / 2000)))}` : ''
      log(`  ${colors.green}${item.name}${colors.reset} ${item.label} ${stars}`)
      log(`    ${colors.gray}${item.description}${colors.reset}`, 'gray')
    }
    log('')
  }

  log(`${colors.gray}使用 --category <分类> 筛选，如: list --category feedback${colors.reset}`, 'gray')
}

// ── search 命令 ───────────────────────────────────────────────────────────────

function handleSearch(args: string[]) {
  if (!args.length) {
    error('请提供搜索关键词')
    process.exit(1)
  }

  const keyword = args.join(' ').toLowerCase()
  const results = vibeui.list().filter(c =>
    c.name.includes(keyword) ||
    c.label.includes(keyword) ||
    c.description.includes(keyword) ||
    c.shadcnEquivalent?.toLowerCase().includes(keyword)
  )

  if (results.length === 0) {
    warn(`没有找到匹配 "${keyword}" 的组件`)
    return
  }

  log(`\n${colors.bold}搜索 "${keyword}" 找到 ${results.length} 个组件:${colors.reset}\n`)
  for (const r of results) {
    log(`  ${colors.green}${r.name}${colors.reset} ${r.label}`)
    log(`    ${colors.gray}${r.description}${colors.reset}`, 'gray')
    log(`    shadcn 等价: ${r.shadcnEquivalent || '无'}`, 'gray')
    log(`    平台: ${Object.keys(r.files).join(', ')}`, 'gray')
    log('')
  }
}

// ── init 命令 ────────────────────────────────────────────────────────────────

async function handleInit(args: string[]) {
  const configPath = path.join(process.cwd(), 'vibeui.config.json')

  if (fs.existsSync(configPath)) {
    warn('vibeui.config.json 已存在')
    return
  }

  const config = {
    $schema: 'https://liangfu.github.io/uniadapter/vibeui.schema.json',
    defaultPlatform: 'weapp',
    outDir: 'src/components',
    styles: true,
    typescript: true,
    components: [
      'button', 'card', 'dialog', 'toast', 'list',
    ],
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8')
  success(`创建: vibeui.config.json`)
  info(`现在可以运行 npx @liangfu/uniadapter add --preset 开始添加组件`)
}

// ── 工具 ────────────────────────────────────────────────────────────────────

// ── template 命令 ───────────────────────────────────────────────────────────────

async function handleTemplate(args: string[]) {
  const action = args[0] || 'list'
  const name = args[1]
  const CLI_DIR = __dirname
  const MANIFEST = path.join(CLI_DIR, '../templates/manifest.json')
  
  if (!fs.existsSync(MANIFEST)) {
    error('Templates not found. Run from project root.')
    return
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'))
  
  if (action === 'list' || !action) {
    log(`\n${colors.bold}VibeHub Templates${colors.reset} - ${manifest.templates.length} templates available`)
    log(String('─').repeat(52))
    
    const catMap: Record<string, string> = { auth: 'AUTH', commerce: 'COMMERCE', user: 'USER', discovery: 'DISCOVERY' }
    for (const cat of ['auth', 'commerce', 'user', 'discovery']) {
      const items = (manifest.templates as any[]).filter((t: any) => t.category === cat)
      if (!items.length) continue
      log(`\n  ${colors.bold}[${catMap[cat]}]${colors.reset}`)
      for (const t of items as any[]) {
        const diff = t.difficulty === 'easy' ? '🟢' : '🟡'
        log(`    ${diff} ${colors.green}${String(t.id).padEnd(16)}${colors.reset} ${t.name}`)
        log(`    ${' '.repeat(18)}${colors.gray}${t.description}${colors.reset}`, 'gray')
        log(`    ${' '.repeat(18)}Platforms: ${t.platforms.join('/')}`, 'gray')
      }
    }
    log('\n  Usage: uniadapter template add <name>')
    log('  Example: uniadapter template add login')
    return
  }
  
  if (action === 'add') {
    if (!name) { error('Usage: uniadapter template add <name>'); return }
    const tmpl = (manifest.templates as any[]).find((t: any) => t.id === name)
    if (!tmpl) { error(`Template "${name}" not found. Run: uniadapter template list`); return }
    const src = path.join(CLI_DIR, '../templates', name + '.tsx')
    if (!fs.existsSync(src)) { error('Template file not found: ' + src); return }
    const destDir = path.join(process.cwd(), 'src/pages', name)
    fs.mkdirSync(destDir, { recursive: true })
    const dest = path.join(destDir, 'index.tsx')
    fs.copyFileSync(src, dest)
    const cfg = path.join(destDir, 'index.config.ts')
    fs.writeFileSync(cfg, `export default { navigationBarTitleText: '${tmpl.name}' }\n`)
    success(`Template added: ${dest}`)
    info('Next: add to app.config.ts pages array, then npm run dev:weapp')
    return
  }
  
  if (action === 'preview') {
    if (!name) { error('Usage: uniadapter template preview <name>'); return }
    log(`\n  🌐 Preview: https://uniblock.app/vibehub/preview/${name}`)
    log('  (Coming soon: local preview)\n')
    return
  }
  
  error(`Unknown action: ${action}`)
  info('Available: list, add, preview')
}

//
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

main().catch(err => {
  error(err.message)
  process.exit(1)
})
