/**
 * UniAdapter VibeEngine - Vibe Coding × 跨端适配核心引擎
 *
 * 用自然语言描述功能，AI 自动生成跨端最优实现。
 *
 * @example
 * import { VibeEngine } from '@liangfu/uniadapter'
 *
 * const engine = new VibeEngine({ platform: 'weapp' })
 * const result = await engine.generate({
 *   prompt: '显示一个下拉刷新列表',
 *   apiKey: process.env.OPENAI_API_KEY,
 * })
 * console.log(result.code) // 微信小程序最优实现
 */

import { detectPlatform } from '../core/types/platform'

export { VibeEngine }

export type Platform = 'h5' | 'weapp' | 'alipay' | 'douyin' | 'xiaohongshu' | 'amap' | 'reactnative'

export interface VibeGenerateOptions {
  /** 自然语言功能描述 */
  prompt: string
  /** 目标平台（自动检测当前平台） */
  platform?: Platform
  /** 是否包含 TypeScript 类型声明 */
  typescript?: boolean
  /** LLM 模型 */
  model?: 'gpt-4o' | 'claude-3.5-sonnet' | 'deepseek-chat'
  /** API Key（优先使用环境变量） */
  apiKey?: string
  /** 基础 URL */
  baseUrl?: string
  /** 启用代码缓存（默认 true） */
  cache?: boolean
  /** 缓存 TTL 毫秒（默认 1 小时） */
  cacheTtl?: number
}

export interface VibeGenerateResult {
  /** 生成的代码 */
  code: string
  /** 代码语言 */
  language: 'typescript' | 'javascript'
  /** 目标平台 */
  platform: Platform
  /** 功能描述 */
  prompt: string
  /** 是否来自缓存 */
  cached?: boolean
  /** 生成耗时毫秒 */
  duration?: number
  /** 警告信息 */
  warnings?: string[]
  /** TypeScript 类型声明（可选） */
  types?: string
}

export interface VibeIntent {
  type: 'storage' | 'request' | 'ui' | 'navigation' | 'system' | 'unknown'
  action: string
  params?: Record<string, unknown>
  confidence: number
}

export interface VibeCapability {
  storage: boolean
  request: boolean
  crypto: boolean
  file: boolean
  notification: boolean
  biometric: boolean
  share: boolean
  location: boolean
}

const PLATFORM_NAMES: Record<Platform, string> = {
  h5: 'Web/H5',
  weapp: '微信小程序',
  alipay: '支付宝小程序',
  douyin: '抖音小程序',
  xiaohongshu: '小红书小程序',
  amap: '高德地图',
  reactnative: 'React Native',
}

const PLATFORM_CAPABILITIES: Record<Platform, VibeCapability> = {
  h5: { storage: true, request: true, crypto: true, file: true, notification: true, biometric: true, share: true, location: true },
  weapp: { storage: true, request: true, crypto: true, file: true, notification: true, biometric: true, share: true, location: true },
  alipay: { storage: true, request: true, crypto: true, file: true, notification: true, biometric: true, share: true, location: true },
  douyin: { storage: true, request: true, crypto: true, file: true, notification: true, biometric: false, share: true, location: true },
  xiaohongshu: { storage: true, request: true, crypto: true, file: true, notification: false, biometric: false, share: true, location: true },
  amap: { storage: false, request: true, crypto: false, file: false, notification: false, biometric: false, share: false, location: true },
  reactnative: { storage: true, request: true, crypto: true, file: true, notification: true, biometric: true, share: true, location: true },
}

const PLATFORM_APIS: Record<Platform, string> = {
  weapp: `wx.getStorageSync(key) / wx.setStorageSync(key, value)
wx.request({ url, method, data })
wx.navigateTo({ url }) / wx.navigateBack({ delta })
wx.showToast({ title, icon })
wx.getUserProfile() / wx.login()
wx.getLocation({ type: 'wgs84' })
wx.showShareMenu()`,

  alipay: `my.getStorageSync({ key }) / my.setStorageSync({ key, data })
my.httpRequest({ url, method, data })
my.navigateTo({ url }) / my.navigateBack()
my.showToast({ content })
my.getAuthCode({ scopes: 'auth_user' })
my.getLocation({ type: 1 })
my.openCustomerServiceChat()`,

  douyin: `tt.getStorageSync(key) / tt.setStorageSync(key, value)
tt.request({ url, method, data })
tt.navigateTo({ url }) / tt.navigateBack()
tt.showToast({ title })
tt.login()
tt.getLocation()
tt.shareAppMessage()`,

  xiaohongshu: `sylinks.getStorageSync(key) / sylinks.setStorageSync(key, value)
sylinks.request({ url, method, data })
sylinks.navigateTo({ url })
sylinks.getLocation()`,

  h5: `localStorage.setItem(key, value) / localStorage.getItem(key)
fetch(url, { method, body, headers })
window.location.href / history.pushState()
document.title = '...'
navigator.clipboard.writeText(text)
navigator.geolocation.getCurrentPosition()
navigator.share({ title, text, url })
Notification.requestPermission()`,

  amap: `AMap.Storage.getItem(key) / AMap.Storage.setItem(key, value)
AMap.HTTP.request({ url })
AMap.Map / AMap.Marker
AMap.plugin('AMap.Geolocation')`,

  reactnative: `AsyncStorage.setItem(key, value) / AsyncStorage.getItem(key)
fetch(url, { method, body, headers })
Navigation.navigate(routeName) / Navigation.goBack()
Alert.alert(title, message)
navigator.geolocation.getCurrentPosition()
Share.share({ title, message, url })
LocalAuthentication.authenticateAsync()`,
}

class VibeEngine {
  private platform: Platform
  private cache: Map<string, { code: string; types: string; timestamp: number }> = new Map()
  private cacheTtl: number

  constructor(options: { platform?: Platform; cacheTtl?: number } = {}) {
    const detected = detectPlatform() as unknown as Platform
    const validPlatforms: Platform[] = ['h5', 'weapp', 'alipay', 'douyin', 'xiaohongshu', 'amap', 'reactnative']
    this.platform = options.platform || (validPlatforms.includes(detected) ? detected : 'h5')
    this.cacheTtl = options.cacheTtl ?? 3600000
  }

  // ── Public API ──────────────────────────────────────────────

  /**
   * 根据自然语言描述生成跨端代码
   */
  async generate(options: VibeGenerateOptions): Promise<VibeGenerateResult> {
    const start = Date.now()
    const platform = options.platform || this.platform
    const prompt = options.prompt.trim()
    const warnings: string[] = []

    // 解析意图
    const intent = this.parseIntent(prompt)
    if (intent.confidence < 0.5) {
      warnings.push(`意图识别置信度较低 (${Math.round(intent.confidence * 100)}%)，结果可能需手动调整`)
    }

    // 检查缓存
    const cacheKey = this.getCacheKey(prompt, platform)
    const cached = this.getFromCache(cacheKey)
    if (cached && options.cache !== false) {
      return { ...cached, cached: true, platform, prompt, duration: Date.now() - start }
    }

    // 生成代码
    let code: string
    let types: string = ''

    const hasLlm = !!(options.apiKey || process.env.OPENAI_API_KEY ||
      process.env.DEEPSEEK_API_KEY || process.env.ANTHROPIC_API_KEY)

    if (hasLlm) {
      const result = await this.generateWithLlm(prompt, platform, intent, options)
      code = result.code
      types = options.typescript ? result.types : ''
    } else {
      const result = this.generateWithTemplate(prompt, platform, intent)
      code = result.code
      types = result.types
      warnings.push('未配置 LLM API Key，使用模板生成。建议配置 OPENAI_API_KEY / DEEPSEEK_API_KEY / ANTHROPIC_API_KEY')
    }

    // 写入缓存
    if (options.cache !== false) {
      this.putToCache(cacheKey, code, types)
    }

    return {
      code,
      language: 'typescript',
      platform,
      prompt,
      cached: false,
      duration: Date.now() - start,
      warnings: warnings.length > 0 ? warnings : undefined,
      types: types || undefined,
    }
  }

  /**
   * 生成多平台版本
   */
  async generateAll(prompt: string, platforms: Platform[]): Promise<Map<Platform, VibeGenerateResult>> {
    const results = new Map<Platform, VibeGenerateResult>()
    await Promise.all(platforms.map(async (p) => {
      results.set(p, await this.generate({ prompt, platform: p }))
    }))
    return results
  }

  /** 解析功能意图 */
  parseIntent(prompt: string): VibeIntent {
    const p = prompt.toLowerCase()
    if (/存|取|删|清|缓存|token|storage|get|set|remove/.test(p)) {
      return { type: 'storage', action: 'storage', confidence: 0.9 }
    }
    if (/请求|fetch|ajax|api|http|网络|加载|load/.test(p)) {
      return { type: 'request', action: 'request', confidence: 0.85 }
    }
    if (/跳转|导航|navigate|push|router/.test(p)) {
      return { type: 'navigation', action: 'navigate', confidence: 0.8 }
    }
    if (/显示|列表|弹窗|按钮|输入|表单|列表|table/.test(p)) {
      return { type: 'ui', action: 'ui', confidence: 0.75 }
    }
    if (/分享|登录|权限|分享|地理|定位/.test(p)) {
      return { type: 'system', action: 'system', confidence: 0.8 }
    }
    return { type: 'unknown', action: 'custom', confidence: 0.5 }
  }

  /** 配置 LLM */
  configureLlm(config: { apiKey?: string; baseUrl?: string; model?: string }): void {
    if (config.apiKey) process.env.OPENAI_API_KEY = config.apiKey
    if (config.baseUrl) process.env.OPENAI_BASE_URL = config.baseUrl
  }

  /** 清除缓存 */
  clearCache(): void { this.cache.clear() }

  /** 获取当前平台 */
  getPlatform(): Platform { return this.platform }

  // ── LLM Generation ──────────────────────────────────────────

  private async generateWithLlm(
    prompt: string,
    platform: Platform,
    intent: VibeIntent,
    options: VibeGenerateOptions
  ): Promise<{ code: string; types: string }> {
    const apiKey = options.apiKey || process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || ''
    const isDeepSeek = !!(options.model?.includes('deepseek') || process.env.DEEPSEEK_API_KEY)
    const isAnthropic = !!(options.apiKey === process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY)
    const baseUrl = options.baseUrl || (isDeepSeek ? 'https://api.deepseek.com' : 'https://api.openai.com/v1')
    const model = options.model || (isDeepSeek ? 'deepseek-chat' : isAnthropic ? 'claude-3-5-sonnet-20241022' : 'gpt-4o')

    const systemPrompt = `你是 UniAdapter VibeEngine，一个跨端代码生成专家。

目标平台：${PLATFORM_NAMES[platform]}
平台能力：${this.getCapabilitySummary(platform)}
关键 API：
${PLATFORM_APIS[platform] || 'N/A'}

任务：根据开发者的自然语言描述，生成 ${PLATFORM_NAMES[platform]} 平台的最优 TypeScript 实现代码。

要求：
1. 只输出代码，不要解释
2. 代码必须完全适配 ${PLATFORM_NAMES[platform]}
3. 使用平台原生 API，避免 polyfill
4. 包含错误处理
5. 如果平台不支持某功能，用条件注释标注
6. 代码要有实际可用的完整实现，不是伪代码

返回格式（严格）：
\`\`\`typescript
// 生成的代码
\`\`\`

不要有任何额外的文本输出。`

    const userPrompt = `功能需求：${prompt}\n意图类型：${intent.type} / ${intent.action}\n目标平台：${PLATFORM_NAMES[platform]}${options.typescript !== false ? '\n必须包含完整的 TypeScript 类型声明' : ''}`

    let response: string

    if (isAnthropic) {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({ model, max_tokens: 4096, messages: [{ role: 'user', content: userPrompt }], system: systemPrompt }),
      })
      if (!resp.ok) throw new Error(`Anthropic API error: ${resp.status}`)
      const data = await resp.json() as { content: Array<{ text: string }> }
      response = data.content[0]?.text || ''
    } else {
      const apiPath = isDeepSeek ? '/chat/completions' : '/v1/chat/completions'
      const resp = await fetch(`${baseUrl}${apiPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], temperature: 0.3, max_tokens: 4096 }),
      })
      if (!resp.ok) {
        const err = await resp.text()
        throw new Error(`LLM API error ${resp.status}: ${err}`)
      }
      const data = await resp.json() as { choices: Array<{ message: { content: string } }> }
      response = data.choices[0]?.message?.content || ''
    }

    // 提取代码块
    const codeMatch = response.match(/```(?:typescript|javascript|ts|js)?\s*([\s\S]*?)```/)
    let code = codeMatch ? codeMatch[1].trim() : response.trim()
    let types = ''

    // 分离类型声明
    const typeMatch = code.match(/(export\s+(?:interface|type|enum)\s+[\s\S]*?)(?=\nexport|export\s+function|export\s+const|import\s+)/)
    if (typeMatch) {
      types = typeMatch[1].trim()
      code = code.replace(typeMatch[1], '').trim()
    }

    return { code, types }
  }

  // ── Template Generation (No LLM) ───────────────────────────

  private generateWithTemplate(prompt: string, platform: Platform, intent: VibeIntent): { code: string; types: string } {
    switch (intent.type) {
      case 'storage': return this.tplStorage(prompt, platform)
      case 'request': return this.tplRequest(platform)
      case 'navigation': return this.tplNavigate(prompt, platform)
      case 'system': return this.tplSystem(prompt, platform)
      case 'ui': return this.tplUI(prompt, platform)
      default: return this.tplGeneric(prompt, platform)
    }
  }

  private tplStorage(prompt: string, platform: Platform): { code: string; types: string } {
    const api = PLATFORM_APIS[platform] || PLATFORM_APIS.h5
    const isSave = /存|set|save|写|添加/.test(prompt.toLowerCase())
    const isRemove = /删|remove|del|清/.test(prompt.toLowerCase())
    const isClear = /清空|clear|reset/.test(prompt.toLowerCase())

    if (isClear) {
      return {
        code: `// UniAdapter VibeEngine - 清除存储
// 平台: ${PLATFORM_NAMES[platform]}

import { createStorageAdapter } from '@liangfu/uniadapter'

const storage = await createStorageAdapter()
await storage.clear()
console.log('存储已清除')`,
        types: '',
      }
    }

    if (isRemove) {
      const keyMatch = prompt.match(/(?:token|用户信息|token|user(?:Info)?|data)/i)
      const key = keyMatch ? keyMatch[0] : 'key'
      return {
        code: `// UniAdapter VibeEngine - 删除存储
// 平台: ${PLATFORM_NAMES[platform]}

import { createStorageAdapter } from '@liangfu/uniadapter'

const storage = await createStorageAdapter()
await storage.remove('${key}')
console.log('${key} 已删除')`,
        types: '',
      }
    }

    return {
      code: `// UniAdapter VibeEngine - 存储操作
// 平台: ${PLATFORM_NAMES[platform]}

import { createStorageAdapter } from '@liangfu/uniadapter'

const storage = await createStorageAdapter()

// 保存数据
await storage.set('data', { value: 'example' })

// 读取数据
const data = await storage.get<{ value: string }>('data')
console.log('读取数据:', data)

// 删除数据
await storage.remove('data')`,
      types: '',
    }
  }

  private tplRequest(platform: Platform): { code: string; types: string } {
    const apiLines = (PLATFORM_APIS[platform] || PLATFORM_APIS.h5)
      .split('\n').slice(0, 5).join('\n')

    return {
      code: `// UniAdapter VibeEngine - 网络请求
// 平台: ${PLATFORM_NAMES[platform]}

import { createStorageAdapter } from '@liangfu/uniadapter'

const storage = await createStorageAdapter()

// 通用请求函数
async function request<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<{ data: T; code: number }> {
  try {
    const token = await storage.get<string>('token')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: \`Bearer \${token}\` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    }

    // ${PLATFORM_NAMES[platform]} 平台请求
    // ${apiLines}

    const response = await fetch(url, { ...options, headers })
    const data = await response.json()
    return { data, code: 0 }
  } catch (error) {
    console.error('请求失败:', error)
    return { data: null as T, code: -1 }
  }
}

// 使用示例
const result = await request('/api/data', { method: 'GET' })
if (result.code === 0) {
  console.log('数据:', result.data)
}`,
      types: '',
    }
  }

  private tplNavigate(prompt: string, platform: Platform): { code: string; types: string } {
    const isBack = /返回|back/.test(prompt.toLowerCase())
    const isTab = /tab|底部/.test(prompt.toLowerCase())

    if (isBack) {
      return {
        code: `// 返回上一页
uni.navigateBack({ delta: 1 })`,
        types: '',
      }
    }

    if (isTab) {
      return {
        code: `// 跳转 Tab 页面
uni.switchTab({ url: '/pages/index/index' })`,
        types: '',
      }
    }

    return {
      code: `// 页面跳转
uni.navigateTo({ url: '/pages/target/index?id=123' })

// 或使用 React Router（React Native）
// Navigation.navigate('Target', { id: '123' })`,
      types: '',
    }
  }

  private tplSystem(prompt: string, platform: Platform): { code: string; types: string } {
    const isShare = /分享|share/.test(prompt.toLowerCase())
    const isLogin = /登录|login|auth/.test(prompt.toLowerCase())
    const isLocation = /定位|地理|location/.test(prompt.toLowerCase())

    if (isLogin) {
      return {
        code: `// UniAdapter VibeEngine - 登录
// 平台: ${PLATFORM_NAMES[platform]}

import { createStorageAdapter } from '@liangfu/uniadapter'

const storage = await createStorageAdapter()

async function login(): Promise<boolean> {
  try {
    // ${PLATFORM_NAMES[platform]} 登录
    const loginResult = await new Promise<{ code: string; encryptedData: string; iv: string }>((resolve, reject) => {
      // 实际登录逻辑根据平台不同而不同
      uni.login({
        success: (res) => {
          if (res.code) {
            resolve({ code: res.code, encryptedData: '', iv: '' })
          } else {
            reject(new Error('登录失败'))
          }
        },
        fail: reject,
      })
    })

    // 获取用户信息
    // ...

    // 保存登录态
    await storage.set('token', loginResult.code)
    await storage.set('loginTime', Date.now().toString())
    return true
  } catch (error) {
    console.error('登录失败:', error)
    return false
  }
}

// 使用
const success = await login()
console.log('登录结果:', success)`,
        types: '',
      }
    }

    if (isLocation) {
      return {
        code: `// UniAdapter VibeEngine - 地理定位
// 平台: ${PLATFORM_NAMES[platform]}

interface Location {
  latitude: number
  longitude: number
  accuracy: number
}

async function getCurrentLocation(): Promise<Location | null> {
  return new Promise((resolve) => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          accuracy: res.accuracy,
        })
      },
      fail: () => resolve(null),
    })
  })
}

// 使用
const location = await getCurrentLocation()
console.log('当前位置:', location)`,
        types: 'interface Location { latitude: number; longitude: number; accuracy: number }',
      }
    }

    if (isShare) {
      return {
        code: `// UniAdapter VibeEngine - 分享
// 平台: ${PLATFORM_NAMES[platform]}

uni.showShareMenu({
  withShareTicket: true,
  menus: ['shareAppMessage', 'shareTimeline'],
})

// 自定义分享内容
uni.onShareAppMessage(() => ({
  title: '分享标题',
  desc: '分享描述',
  path: '/pages/index/index',
}))`,
        types: '',
      }
    }

    return {
      code: `// UniAdapter VibeEngine - 系统能力
// 功能: ${prompt}
// 平台: ${PLATFORM_NAMES[platform]}

// 建议配置 LLM API Key 生成精确实现
console.log('功能: ${prompt}')`,
      types: '',
    }
  }

  private tplUI(prompt: string, platform: Platform): { code: string; types: string } {
    const isList = /列表|list|table/.test(prompt.toLowerCase())

    if (isList) {
      return {
        code: `// UniAdapter VibeEngine - 列表展示
// 平台: ${PLATFORM_NAMES[platform]}

interface ListItem {
  id: string | number
  title: string
  image?: string
  [key: string]: unknown
}

// 建议使用 LLM 生成精确列表组件代码
// 配置 OPENAI_API_KEY / DEEPSEEK_API_KEY 以获得最佳效果

// ${PLATFORM_NAMES[platform]} 列表示例：
// const list = await request<ListItem[]>('/api/list')
// setItems(list.data)
console.log('建议: 请配置 LLM API Key 生成精确列表组件')`,
        types: 'interface ListItem { id: string | number; title: string; image?: string; [key: string]: unknown }',
      }
    }

    return {
      code: `// UniAdapter VibeEngine - UI 生成
// 功能: ${prompt}
// 平台: ${PLATFORM_NAMES[platform]}

// 建议配置 LLM API Key 生成精确 UI 组件
console.log('功能: ${prompt}')`,
      types: '',
    }
  }

  private tplGeneric(prompt: string, platform: Platform): { code: string; types: string } {
    return {
      code: `/**
 * UniAdapter VibeEngine 自动生成
 * 需求: ${prompt}
 * 平台: ${PLATFORM_NAMES[platform]}
 *
 * 建议: 配置 LLM API Key (OPENAI_API_KEY / DEEPSEEK_API_KEY / ANTHROPIC_API_KEY)
 * 以获得基于 AI 的精确代码生成
 *
 * 关键 API:
 * ${(PLATFORM_APIS[platform] || PLATFORM_APIS.h5).split('\n').slice(0, 3).join('\n')}
 */

// 示例：基于描述的智能适配
const platform = '${platform}'
console.log(\`\${platform} 平台适配: ${prompt.replace(/`/g, '\\`')}\`)
`,
      types: '',
    }
  }

  // ── Helpers ─────────────────────────────────────────────────

  private getCapabilitySummary(platform: Platform): string {
    const caps = PLATFORM_CAPABILITIES[platform]
    const features: string[] = []
    if (caps.storage) features.push('本地存储')
    if (caps.request) features.push('网络请求')
    if (caps.crypto) features.push('加密')
    if (caps.file) features.push('文件操作')
    if (caps.notification) features.push('通知推送')
    if (caps.biometric) features.push('生物认证')
    if (caps.share) features.push('分享')
    if (caps.location) features.push('地理定位')
    return features.join('、')
  }

  private getCacheKey(prompt: string, platform: Platform): string {
    return `${platform}:${prompt.substring(0, 80)}`
  }

  private getFromCache(key: string): VibeGenerateResult | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    if (Date.now() - entry.timestamp > this.cacheTtl) {
      this.cache.delete(key)
      return null
    }
    return {
      code: entry.code,
      types: entry.types,
      language: 'typescript',
      platform: this.platform,
      prompt: '',
      cached: true,
    }
  }

  private putToCache(key: string, code: string, types: string): void {
    this.cache.set(key, { code, types, timestamp: Date.now() })
  }
}
