/**
 * UniAdapter MCP Server
 * 
 * 让 AI Coding Agent（Cursor / Windsurf / Copilot Workspace）直接操作 uniadapter 项目。
 * 
 * 使用方式：
 *   npx @liangfu/uniadapter mcp
 * 
 * 或在 Cursor/Windsurf 的 MCP 配置中添加：
 * {
 *   "mcpServers": {
 *     "uniadapter": {
 *       "command": "npx",
 *       "args": ["@liangfu/uniadapter", "mcp"]
 *     }
 *   }
 * }
 * 
 * 可用工具：
 * - vibe_generate     : 自然语言生成跨端代码
 * - vibe_list_pages  : 列出页面模板
 * - vibe_list_components: 列出可用的组件
 * - vibe_build       : 构建项目
 * - vibe_test        : 运行测试
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ListPromptsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { VibeEngine, type VibeGenerateOptions } from '../vibe-engine/engine.js'

// ── Server setup ─────────────────────────────────────────────────────────────

const server = new Server(
  {
    name: 'uniadapter-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
)

// ── VibeEngine instance ───────────────────────────────────────────────────────

let engine: VibeEngine | null = null

function getEngine(platform?: string): VibeEngine {
  if (!engine) {
    engine = new VibeEngine({
      platform: (platform as any) || 'weapp',
    })
  }
  return engine
}

// ── Tools registry ────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'vibe_generate',
        description: '根据自然语言描述生成跨端小程序代码。根据用户需求，生成适配多个平台的完整页面或组件源代码。',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: '用自然语言描述你想要的小程序页面或组件。例如："帮我做一个商品详情页，包含轮播图、价格、SKU选择、加购按钮"',
            },
            platform: {
              type: 'string',
              description: '目标平台',
              enum: ['weapp', 'alipay', 'douyin', 'h5', 'all'],
              default: 'weapp',
            },
            type: {
              type: 'string',
              description: '生成类型',
              enum: ['page', 'component', 'hook', 'all'],
              default: 'page',
            },
          },
          required: ['prompt'],
        },
      },
      {
        name: 'vibe_list_components',
        description: '列出 UniAdapter VibeUI 组件注册表中的所有可用组件。支持微信小程序、支付宝、抖音小程序、H5。',
        inputSchema: {
          type: 'object',
          properties: {
            platform: {
              type: 'string',
              description: '平台过滤',
              enum: ['weapp', 'alipay', 'douyin', 'h5', 'all'],
              default: 'all',
            },
            category: {
              type: 'string',
              description: '组件分类过滤（layout/form/data-display/feedback/navigation/other）',
            },
            search: {
              type: 'string',
              description: '搜索关键词（匹配组件名或描述）',
            },
          },
        },
      },
      {
        name: 'vibe_list_pages',
        description: '列出 UniAdapter 内置的页面模板，可快速生成常见业务页面。',
        inputSchema: {
          type: 'object',
          properties: {
            platform: {
              type: 'string',
              description: '平台过滤',
              enum: ['weapp', 'alipay', 'douyin', 'h5', 'all'],
              default: 'all',
            },
            category: {
              type: 'string',
              description: '页面分类（ecommerce/social/tool/admin）',
            },
          },
        },
      },
      {
        name: 'vibe_platform_info',
        description: '获取指定平台的能力信息和适配状态，帮助理解各平台的 API 差异和 UniAdapter 的处理方式。',
        inputSchema: {
          type: 'object',
          properties: {
            platform: {
              type: 'string',
              description: '目标平台',
              enum: ['weapp', 'alipay', 'douyin', 'h5', 'all'],
              default: 'all',
            },
          },
        },
      },
      {
        name: 'vibe_adapt_code',
        description: '将已有的微信小程序代码适配到其他平台（支付宝/抖音/H5），自动处理 API 差异。输入原始代码，输出适配后的多平台代码。',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: '原始代码（微信小程序代码）',
            },
            targetPlatform: {
              type: 'string',
              description: '目标平台',
              enum: ['alipay', 'douyin', 'h5', 'all'],
              default: 'all',
            },
          },
          required: ['code'],
        },
      },
    ],
  }
})

// ── Tool handlers ─────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {

      case 'vibe_generate': {
        const opts: VibeGenerateOptions = {
          prompt: args.prompt as string,
          platform: args.platform as any || 'weapp',
          type: args.type as any || 'page',
        }
        const result = await getEngine(opts.platform).generate(opts)
        return {
          content: [
            {
              type: 'text',
              text: formatGenerateResult(result),
            },
          ],
        }
      }

      case 'vibe_list_components': {
        const components = listComponents(args.platform as string, args.category as string, args.search as string)
        return {
          content: [{ type: 'text', text: formatComponentList(components) }],
        }
      }

      case 'vibe_list_pages': {
        const pages = listPageTemplates(args.platform as string, args.category as string)
        return {
          content: [{ type: 'text', text: formatPageList(pages) }],
        }
      }

      case 'vibe_platform_info': {
        const info = getPlatformInfo(args.platform as string)
        return {
          content: [{ type: 'text', text: info }],
        }
      }

      case 'vibe_adapt_code': {
        const result = await adaptCode(args.code as string, args.targetPlatform as string)
        return {
          content: [{ type: 'text', text: result }],
        }
      }

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        }
    }
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    }
  }
})

// ── Resources ────────────────────────────────────────────────────────────────

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'uniadapter://components',
        name: 'VibeUI 组件注册表',
        description: 'UniAdapter 的 shadcn 风格小程序组件注册表',
        mimeType: 'application/json',
      },
      {
        uri: 'uniadapter://platforms',
        name: '平台支持状态',
        description: 'UniAdapter 各平台适配状态和能力对比',
        mimeType: 'application/json',
      },
      {
        uri: 'uniadapter://version',
        name: '版本信息',
        description: '当前 UniAdapter 版本和发布信息',
        mimeType: 'text/plain',
      },
    ],
  }
})

// ── Prompts ──────────────────────────────────────────────────────────────────

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'vibe_new_page',
        description: '创建一个新的小程序页面，引导用户描述需求后生成跨端代码',
        arguments: [
          { name: 'platform', description: '目标平台', required: false },
          { name: 'description', description: '页面需求描述', required: false },
        ],
      },
      {
        name: 'vibe_migrate',
        description: '将微信小程序代码迁移到其他平台（支付宝/抖音/H5）',
        arguments: [
          { name: 'code', description: '微信小程序原始代码', required: true },
          { name: 'target', description: '目标平台', required: true },
        ],
      },
    ],
  }
})

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatGenerateResult(result: any): string {
  const lines: string[] = []
  lines.push(`✅ 生成完成！`)
  lines.push(``)
  lines.push(`**意图识别：** ${result.intent?.type || 'unknown'} - ${result.intent?.description || ''}`)
  lines.push(`**生成类型：** ${result.metadata?.type || 'page'}`)
  lines.push(`**目标平台：** ${(result.metadata?.platforms || []).join(', ')}`)
  lines.push(``)
  lines.push(`**生成文件：**`)
  for (const [filename, content] of Object.entries(result.files || {})) {
    lines.push(`\n--- ${filename} ---`)
    lines.push(String(content))
  }
  if (result.cache) {
    lines.push(``)
    lines.push(`*（来自缓存，生成时间 ${result.metadata?.generatedAt || ''}）*`)
  }
  return lines.join('\n')
}

interface ComponentInfo {
  name: string
  nameCn: string
  description: string
  category: string
  platforms: string[]
}

const VIBEUI_COMPONENTS: ComponentInfo[] = [
  // Layout
  { name: 'flex', nameCn: 'Flex 布局', description: '弹性盒子布局，支持水平和垂直方向', category: 'layout', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'grid', nameCn: 'Grid 网格', description: '响应式网格布局，自动行列计算', category: 'layout', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'space', nameCn: 'Space 间距', description: '自动管理元素之间的间距', category: 'layout', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'divider', nameCn: 'Divider 分割线', description: '内容分隔符，支持水平和垂直', category: 'layout', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'app-shell', nameCn: 'App Shell', description: '小程序外壳：顶部导航 + 底部 TabBar', category: 'layout', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  // Form
  { name: 'button', nameCn: 'Button 按钮', description: '多类型按钮：主按钮/次按钮/危险按钮/幽灵按钮', category: 'form', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'input', nameCn: 'Input 输入框', description: '多类型输入框：文本/数字/密码/搜索框', category: 'form', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'textarea', nameCn: 'Textarea 多行输入', description: '多行文本输入框，支持自动增高', category: 'form', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'form', nameCn: 'Form 表单', description: '表单容器，统一的表单状态管理', category: 'form', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'radio', nameCn: 'Radio 单选', description: '单选组件，支持单项和分组', category: 'form', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'checkbox', nameCn: 'Checkbox 多选', description: '多选组件，支持全选和分组', category: 'form', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'switch', nameCn: 'Switch 开关', description: '开关切换组件', category: 'form', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'slider', nameCn: 'Slider 滑块', description: '滑动选择器，用于范围选择', category: 'form', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'picker', nameCn: 'Picker 选择器', description: '多列选择器：日期/时间/地区/自定义', category: 'form', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  // Data Display
  { name: 'card', nameCn: 'Card 卡片', description: '卡片容器，用于展示结构化信息', category: 'data-display', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'list', nameCn: 'List 列表', description: '列表组件，支持无限滚动和下拉刷新', category: 'data-display', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'table', nameCn: 'Table 表格', description: '表格组件，支持排序和固定列', category: 'data-display', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'badge', nameCn: 'Badge 徽标', description: '数字徽标和状态点', category: 'data-display', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'avatar', nameCn: 'Avatar 头像', description: '用户头像，支持图片/文字/图标', category: 'data-display', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'tag', nameCn: 'Tag 标签', description: '标签组件，支持多种样式和可关闭', category: 'data-display', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'progress', nameCn: 'Progress 进度条', description: '线性进度条和环形进度', category: 'data-display', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  // Feedback
  { name: 'toast', nameCn: 'Toast 轻提示', description: '轻量级反馈提示，自动消失', category: 'feedback', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'modal', nameCn: 'Modal 对话框', description: '模态对话框，支持自定义内容', category: 'feedback', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'action-sheet', nameCn: 'ActionSheet 操作菜单', description: '底部弹出操作菜单', category: 'feedback', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'skeleton', nameCn: 'Skeleton 骨架屏', description: '内容加载占位骨架屏', category: 'feedback', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'pull-to-refresh', nameCn: 'PullToRefresh 下拉刷新', description: '下拉刷新和上拉加载更多', category: 'feedback', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  // Navigation
  { name: 'navbar', nameCn: 'NavBar 导航栏', description: '自定义导航栏，支持返回按钮和标题', category: 'navigation', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'tabbar', nameCn: 'TabBar 标签栏', description: '底部标签导航栏', category: 'navigation', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'sidebar', nameCn: 'Sidebar 侧边导航', description: '左侧分类侧边栏，常用于商品分类', category: 'navigation', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'tabs', nameCn: 'Tabs 标签页', description: '顶部标签切换组件', category: 'navigation', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'links', nameCn: 'Links 链接', description: '小程序内页面跳转链接', category: 'navigation', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  // Other
  { name: 'safe-area', nameCn: 'SafeArea 安全区域', description: '适配刘海屏和圆角屏的安全区域', category: 'other', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'locale-provider', nameCn: 'LocaleProvider', description: '国际化上下文提供者', category: 'other', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
  { name: 'config-provider', nameCn: 'ConfigProvider', description: '主题配置上下文', category: 'other', platforms: ['weapp', 'alipay', 'douyin', 'h5'] },
]

function listComponents(platform = 'all', category?: string, search?: string): ComponentInfo[] {
  let list = VIBEUI_COMPONENTS
  if (platform !== 'all') {
    list = list.filter(c => c.platforms.includes(platform) || c.platforms.includes('all'))
  }
  if (category) {
    list = list.filter(c => c.category === category)
  }
  if (search) {
    const q = search.toLowerCase()
    list = list.filter(c =>
      c.name.includes(q) || c.nameCn.includes(q) || c.description.includes(q)
    )
  }
  return list
}

function formatComponentList(components: ComponentInfo[]): string {
  const lines: string[] = []
  lines.push(`📦 VibeUI 组件注册表 · ${components.length} 个组件`)
  lines.push('')

  const byCategory: Record<string, ComponentInfo[]> = {}
  for (const c of components) {
    if (!byCategory[c.category]) byCategory[c.category] = []
    byCategory[c.category].push(c)
  }

  const catNames: Record<string, string> = {
    'layout': '📐 布局',
    'form': '📝 表单',
    'data-display': '📊 数据展示',
    'feedback': '💬 反馈',
    'navigation': '🧭 导航',
    'other': '🛠 其他',
  }

  for (const [cat, items] of Object.entries(byCategory)) {
    lines.push(`**${catNames[cat] || cat}** (${items.length})`)
    for (const c of items) {
      lines.push(`  - \`${c.name}\` ${c.nameCn} — ${c.description}`)
    }
    lines.push('')
  }

  lines.push('使用 `vibe_generate` 工具生成这些组件的代码。')
  return lines.join('\n')
}

interface PageTemplate {
  id: string
  name: string
  nameCn: string
  description: string
  category: string
  platforms: string[]
  tags: string[]
}

const PAGE_TEMPLATES: PageTemplate[] = [
  { id: 'product-detail', name: 'product-detail', nameCn: '商品详情', description: '含轮播图/SKU选择/加购按钮/店铺信息/评价入口', category: 'ecommerce', platforms: ['weapp', 'alipay', 'douyin', 'h5'], tags: ['商品', '电商', 'SKU'] },
  { id: 'product-list', name: 'product-list', nameCn: '商品列表', description: '瀑布流/列表布局，含筛选/排序/搜索/分页', category: 'ecommerce', platforms: ['weapp', 'alipay', 'douyin', 'h5'], tags: ['列表', '搜索', '筛选'] },
  { id: 'cart', name: 'cart', nameCn: '购物车', description: '商品勾选/数量编辑/价格计算/删除/结算', category: 'ecommerce', platforms: ['weapp', 'alipay', 'douyin', 'h5'], tags: ['购物车', '电商'] },
  { id: 'order-confirm', name: 'order-confirm', nameCn: '订单确认', description: '收货地址/商品列表/支付方式/优惠券/发票', category: 'ecommerce', platforms: ['weapp', 'alipay', 'douyin', 'h5'], tags: ['订单', '支付'] },
  { id: 'order-list', name: 'order-list', nameCn: '订单列表', description: '订单状态标签（全部/待付款/待发货等）', category: 'ecommerce', platforms: ['weapp', 'alipay', 'douyin', 'h5'], tags: ['订单', '列表'] },
  { id: 'login', name: 'login', nameCn: '登录注册', description: '手机号+验证码/微信一键登录/协议勾选', category: 'user', platforms: ['weapp', 'alipay', 'douyin', 'h5'], tags: ['登录', '注册', '用户'] },
  { id: 'profile', name: 'profile', nameCn: '个人中心', description: '用户头像/会员等级/订单入口/资产/功能列表', category: 'user', platforms: ['weapp', 'alipay', 'douyin', 'h5'], tags: ['用户', '个人中心'] },
  { id: 'address-list', name: 'address-list', nameCn: '地址管理', description: '地址列表/新增/编辑/删除/默认地址设置', category: 'user', platforms: ['weapp', 'alipay', 'douyin', 'h5'], tags: ['地址', '用户'] },
  { id: 'article-detail', name: 'article-detail', nameCn: '文章详情', description: '标题/作者/发布时间/正文/点赞/评论', category: 'content', platforms: ['weapp', 'alipay', 'douyin', 'h5'], tags: ['文章', '内容'] },
  { id: 'home', name: 'home', nameCn: '首页', description: '搜索/banner轮播/分类导航/活动区块/商品推荐', category: 'ecommerce', platforms: ['weapp', 'alipay', 'douyin', 'h5'], tags: ['首页', '电商'] },
  { id: 'category', name: 'category', nameCn: '分类页', description: '左侧分类导航/右侧商品网格', category: 'ecommerce', platforms: ['weapp', 'alipay', 'douyin', 'h5'], tags: ['分类', '导航'] },
  { id: 'search', name: 'search', nameCn: '搜索页', description: '搜索框/历史记录/热门搜索/搜索结果', category: 'tool', platforms: ['weapp', 'alipay', 'douyin', 'h5'], tags: ['搜索'] },
  { id: 'settings', name: 'settings', nameCn: '设置页', description: '列表项：通知/隐私/清除缓存/关于我们', category: 'user', platforms: ['weapp', 'alipay', 'douyin', 'h5'], tags: ['设置', '用户'] },
  { id: 'feedback', name: 'feedback', nameCn: '意见反馈', description: '反馈类型选择/图片上传/文本输入/提交', category: 'tool', platforms: ['weapp', 'alipay', 'douyin', 'h5'], tags: ['反馈', '表单'] },
]

function listPageTemplates(platform = 'all', category?: string): PageTemplate[] {
  let list = PAGE_TEMPLATES
  if (platform !== 'all') {
    list = list.filter(p => p.platforms.includes(platform))
  }
  if (category) {
    list = list.filter(p => p.category === category)
  }
  return list
}

function formatPageList(pages: PageTemplate[]): string {
  const lines: string[] = []
  lines.push(`📄 UniAdapter 页面模板 · ${pages.length} 个模板`)
  lines.push('')

  const byCategory: Record<string, PageTemplate[]> = {}
  for (const p of pages) {
    if (!byCategory[p.category]) byCategory[p.category] = []
    byCategory[p.category].push(p)
  }

  const catNames: Record<string, string> = {
    'ecommerce': '🛒 电商',
    'user': '👤 用户',
    'content': '📝 内容',
    'tool': '🛠 工具',
    'admin': '📊 管理',
  }

  for (const [cat, items] of Object.entries(byCategory)) {
    lines.push(`**${catNames[cat] || cat}** (${items.length})`)
    for (const p of items) {
      lines.push(`  - \`${p.name}\` ${p.nameCn} — ${p.description}`)
      lines.push(`    平台: ${p.platforms.join('/')} | 标签: ${p.tags.join(', ')}`)
    }
    lines.push('')
  }

  lines.push('使用 `vibe_generate` 并描述需求，VibeEngine 会自动匹配模板生成代码。')
  return lines.join('\n')
}

function getPlatformInfo(platform = 'all'): string {
  const platforms: Record<string, any> = {
    weapp: {
      name: '微信小程序',
      fullName: 'WeChat Mini-Program',
      emoji: '💚',
      api: 'wx.*',
      features: ['微信支付', '微信登录', '微信分享', '微信收藏', '附近的小程序', '订阅消息'],
      capabilities: ['storage', 'network', 'media', 'location', 'scan', 'nfc'],
      notes: 'UniAdapter 完全适配，API 覆盖最全面',
    },
    alipay: {
      name: '支付宝小程序',
      fullName: 'Alipay Mini-Program',
      emoji: '🔵',
      api: 'my.*',
      features: ['支付宝支付', '芝麻信用', '花呗', '支付宝登录'],
      capabilities: ['storage', 'network', 'location', 'scan'],
      notes: 'UniAdapter 完全适配，部分 API 名称不同',
    },
    douyin: {
      name: '抖音小程序',
      fullName: 'Douyin Mini-Program',
      emoji: '🎵',
      api: 'tt.*',
      features: ['抖音支付', '抖音登录', '抖音分享', '小程序搜索'],
      capabilities: ['storage', 'network', 'location'],
      notes: 'UniAdapter 完全适配，API 名称基于 tt.*',
    },
    h5: {
      name: 'H5 / Web',
      fullName: 'Mobile Web / Progressive Web App',
      emoji: '🌐',
      api: 'window/document/navigator',
      features: ['PWA', 'Service Worker', 'Web Share API', 'GeoLocation API'],
      capabilities: ['storage', 'network', 'media', 'location', 'notification'],
      notes: 'UniAdapter 适配，使用标准 Web API',
    },
  }

  if (platform === 'all') {
    const lines: string[] = []
    lines.push('📱 UniAdapter 平台支持状态')
    lines.push('')
    for (const [key, info] of Object.entries(platforms)) {
      lines.push(`${info.emoji} **${info.name}** (${info.fullName})`)
      lines.push(`   API 前缀: \`${info.api}\``)
      lines.push(`   特色能力: ${info.features.join(' · ')}`)
      lines.push(`   说明: ${info.notes}`)
      lines.push('')
    }
    return lines.join('\n')
  }

  const info = platforms[platform]
  if (!info) return `Unknown platform: ${platform}`

  const lines: string[] = []
  lines.push(`${info.emoji} **${info.name}** (${info.fullName})`)
  lines.push('')
  lines.push(`**API 前缀:** \`${info.api}\``)
  lines.push('')
  lines.push(`**特色能力:**`)
  for (const f of info.features) {
    lines.push(`  - ${f}`)
  }
  lines.push('')
  lines.push(`**系统能力:** ${info.capabilities.join(', ')}`)
  lines.push('')
  lines.push(`**说明:** ${info.notes}`)
  return lines.join('\n')
}

async function adaptCode(code: string, targetPlatform: string): Promise<string> {
  // Simple code adaptation - replace common WeChat API calls
  let adapted = code

  const replacements: Record<string, Record<string, string>> = {
    alipay: {
      'wx.': 'my.',
      'wx.getStorageSync': 'my.getStorageSync',
      'wx.setStorageSync': 'my.setStorageSync',
      'wx.request': 'my.httpRequest',
      'wx.showToast': 'my.showToast',
      'wx.showModal': 'my.confirm',
      'wx.navigateTo': 'my.navigateTo',
      'wx.redirectTo': 'my.redirectTo',
      'wx.reLaunch': 'my.reLaunch',
      'wx.switchTab': 'my.switchTab',
      'wx.chooseImage': 'my.chooseImage',
      'wx.getUserProfile': 'my.getUserInfo',
      'wx.login': 'my.getAuthCode',
      'wx.getLocation': 'my.getLocation',
      'wx.scanCode': 'my.scan',
      'wx.setNavigationBarTitle': 'my.setNavigationBar',
      'wx.showLoading': 'my.showLoading',
      'wx.hideLoading': 'my.hideLoading',
      'wx.stopPullDownRefresh': 'my.stopPullDownRefresh',
      'wx.startPullDownRefresh': 'my.startPullDownRefresh',
    },
    douyin: {
      'wx.': 'tt.',
      'wx.getStorageSync': 'tt.getStorageSync',
      'wx.setStorageSync': 'tt.setStorageSync',
      'wx.request': 'tt.request',
      'wx.showToast': 'tt.showToast',
      'wx.showModal': 'tt.showModal',
      'wx.navigateTo': 'tt.navigateTo',
      'wx.redirectTo': 'tt.redirectTo',
      'wx.reLaunch': 'tt.reLaunch',
      'wx.switchTab': 'tt.switchTab',
      'wx.chooseImage': 'tt.chooseImage',
      'wx.getUserInfo': 'tt.getUserInfo',
      'wx.login': 'tt.login',
      'wx.getLocation': 'tt.getLocation',
      'wx.scanCode': 'tt.scanCode',
    },
    h5: {
      'wx.': '// uni.',
      'wx.getStorageSync': 'uni.getStorageSync',
      'wx.setStorageSync': 'uni.setStorageSync',
      'wx.request': 'fetch',
      'wx.navigateTo': 'uni.navigateTo',
      'wx.showToast': 'alert',
    },
  }

  const repl = targetPlatform === 'all' ? replacements : replacements[targetPlatform] || {}

  if (targetPlatform === 'all') {
    const lines: string[] = []
    lines.push('🔄 代码适配结果（微信小程序 → 多平台）')
    lines.push('')
    for (const [plat, map] of Object.entries(replacements)) {
      const platName = { alipay: '💙 支付宝', douyin: '🎵 抖音', h5: '🌐 H5' }[plat] || plat
      lines.push(`**${platName}**`)
      lines.push('```' + (plat === 'douyin' ? 'typescript' : 'typescript') + '')
      let result = code
      for (const [from, to] of Object.entries(map)) {
        if (from !== 'wx.') {
          result = result.split(from).join(to)
        }
      }
      lines.push(result)
      lines.push('```')
      lines.push('')
    }
    return lines.join('\n')
  }

  let result = code
  for (const [from, to] of Object.entries(repl)) {
    if (from !== 'wx.') {
      result = result.split(from).join(to)
    }
  }

  const platName = { alipay: '💙 支付宝小程序', douyin: '🎵 抖音小程序', h5: '🌐 H5/Web' }[targetPlatform] || targetPlatform
  return `🔄 已适配为 ${platName}\n\n使用以下 API 前缀替换规则：\n${Object.entries(repl).filter(([k]) => k !== 'wx.').map(([k, v]) => `- \`${k}\` → \`${v}\``).join('\n')}\n\n\`\`\`typescript\n${result}\n\`\`\``
}

// ── Boot ─────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('[UniAdapter MCP] Server started')
}

main().catch(console.error)
