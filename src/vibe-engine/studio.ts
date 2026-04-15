/**
 * VibeStudio - Vibe Coding 可视化 IDE（无框架版本）
 *
 * 提供自然语言 → 跨端代码的实时转换界面。
 * 使用原生 DOM API，无任何框架依赖。
 *
 * @example
 * import { VibeStudio } from '@liangfu/uniadapter/vibe'
 *
 * const container = document.getElementById('app')!
 * const studio = new VibeStudio(container, {
 *   defaultPrompt: '用户登录并保存 token',
 *   defaultPlatform: 'weapp',
 *   apiKey: 'your-api-key',
 *   onGenerate: (code) => console.log(code),
 * })
 */

export { VibeStudio, type VibeStudioConfig }

export type Platform = 'h5' | 'weapp' | 'alipay' | 'douyin' | 'xiaohongshu' | 'amap' | 'reactnative'

export interface VibeStudioConfig {
  defaultPrompt?: string
  defaultPlatform?: Platform
  theme?: 'dark' | 'light'
  apiKey?: string
  model?: 'gpt-4o' | 'claude-3.5-sonnet' | 'deepseek-chat'
  onGenerate?: (code: string, platform: Platform) => void
  onPromptChange?: (prompt: string) => void
}

interface GenerateResult {
  code: string
  platform: Platform
  cached?: boolean
  duration?: number
  warnings?: string[]
}

const PLATFORM_LABELS: Record<Platform, string> = {
  h5: 'Web/H5',
  weapp: '微信小程序',
  alipay: '支付宝小程序',
  douyin: '抖音小程序',
  xiaohongshu: '小红书小程序',
  amap: '高德地图',
  reactnative: 'React Native',
}

const EXAMPLE_PROMPTS = [
  '用户登录并保存登录状态',
  '显示下拉刷新列表',
  '获取当前位置并显示地图标记',
  '图片上传并压缩',
  '微信分享到朋友',
]

class VibeStudio {
  private container: HTMLElement
  private config: VibeStudioConfig
  private prompt = ''
  private platform: Platform
  private results = new Map<Platform, GenerateResult>()
  private activeTab: Platform
  private loading = false

  constructor(container: HTMLElement, config: VibeStudioConfig = {}) {
    this.container = container
    this.config = config
    this.platform = config.defaultPlatform || 'weapp'
    this.activeTab = this.platform
    this.prompt = config.defaultPrompt || ''
    this.render()
  }

  private render(): void {
    const isDark = this.config.theme !== 'light'
    this.container.innerHTML = ''
    this.container.style.cssText = `
      font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace;
      background: ${isDark ? '#0d1117' : '#ffffff'};
      color: ${isDark ? '#e6edf3' : '#24292f'};
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
      max-width: 900px;
    `

    this.renderHeader(isDark)
    this.renderPromptArea(isDark)
    this.renderResults(isDark)
  }

  private renderHeader(isDark: boolean): void {
    const header = document.createElement('div')
    header.style.cssText = `
      padding: 16px 20px;
      border-bottom: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
      display: flex; align-items: center; gap: 12px;
    `
    header.innerHTML = `
      <span style="font-size: 20px">✨</span>
      <span style="font-weight: 700; font-size: 16px; color: ${isDark ? '#e6edf3' : '#24292f'}">VibeStudio</span>
      <span style="font-size: 12px; padding: 2px 8px; border-radius: 12px; background: ${isDark ? '#1f6feb33' : '#ddf4ff'}; color: ${isDark ? '#58a6ff' : '#0969da'}">Vibe Coding × 跨端</span>
    `
    this.container.appendChild(header)
  }

  private renderPromptArea(isDark: boolean): void {
    const area = document.createElement('div')
    area.style.cssText = 'padding: 20px;'

    // Textarea
    const textareaWrap = document.createElement('div')
    textareaWrap.style.cssText = 'margin-bottom: 12px;'
    const textarea = document.createElement('textarea')
    textarea.value = this.prompt
    textarea.placeholder = '用自然语言描述你想要的功能，例如：用户登录并保存登录状态...'
    textarea.rows = 3
    textarea.style.cssText = `
      width: 100%; padding: 12px 16px; border-radius: 8px;
      border: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
      background: ${isDark ? '#161b22' : '#f6f8fa'};
      color: ${isDark ? '#e6edf3' : '#24292f'};
      font-size: 14px; font-family: inherit; resize: vertical; outline: none;
    `
    textarea.addEventListener('input', () => {
      this.prompt = textarea.value
      this.config.onPromptChange?.(textarea.value)
    })
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        this.handleGenerate()
      }
    })
    textareaWrap.appendChild(textarea)
    area.appendChild(textareaWrap)

    // Example prompts
    const examplesWrap = document.createElement('div')
    examplesWrap.style.cssText = 'display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;'
    for (const p of EXAMPLE_PROMPTS) {
      const btn = document.createElement('button')
      btn.textContent = p
      btn.style.cssText = `
        padding: 4px 10px; border-radius: 16px;
        border: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
        background: transparent; color: ${isDark ? '#8b949e' : '#57606a'};
        font-size: 12px; cursor: pointer;
      `
      btn.addEventListener('click', () => {
        this.prompt = p
        textarea.value = p
        this.config.onPromptChange?.(p)
      })
      examplesWrap.appendChild(btn)
    }
    area.appendChild(examplesWrap)

    // Platform selector
    const platRow = document.createElement('div')
    platRow.style.cssText = 'display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 16px;'
    platRow.innerHTML += `<span style="font-size: 13px; color: ${isDark ? '#8b949e' : '#57606a'}">目标平台:</span>`
    for (const p of Object.keys(PLATFORM_LABELS) as Platform[]) {
      const btn = document.createElement('button')
      btn.textContent = PLATFORM_LABELS[p]
      btn.style.cssText = `
        padding: 4px 12px; border-radius: 6px;
        border: 1.5px solid ${this.platform === p ? '#58a6ff' : (isDark ? '#30363d' : '#d0d7de')};
        background: ${this.platform === p ? (isDark ? '#1f6feb22' : '#ddf4ff') : 'transparent'};
        color: ${this.platform === p ? '#58a6ff' : (isDark ? '#8b949e' : '#57606a')};
        font-size: 13px; cursor: pointer; font-weight: ${this.platform === p ? '600' : '400'};
      `
      btn.addEventListener('click', () => {
        this.platform = p
        this.render()
      })
      platRow.appendChild(btn)
    }
    area.appendChild(platRow)

    // Action buttons
    const actions = document.createElement('div')
    actions.style.cssText = 'display: flex; gap: 8px; align-items: center; flex-wrap: wrap;'

    const genBtn = document.createElement('button')
    genBtn.textContent = '🚀 生成代码'
    genBtn.style.cssText = `
      padding: 8px 20px; border-radius: 8px; border: none;
      background: #238636; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer;
    `
    genBtn.addEventListener('click', () => this.handleGenerate())
    actions.appendChild(genBtn)

    const allBtn = document.createElement('button')
    allBtn.textContent = '📦 生成所有平台'
    allBtn.style.cssText = `
      padding: 8px 16px; border-radius: 8px;
      border: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
      background: transparent; color: ${isDark ? '#8b949e' : '#57606a'};
      font-size: 14px; cursor: pointer;
    `
    allBtn.addEventListener('click', () => this.handleGenerateAll())
    actions.appendChild(allBtn)

    if (this.config.apiKey || process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY) {
      const badge = document.createElement('span')
      badge.textContent = '✅ LLM 已配置'
      badge.style.cssText = 'font-size: 12px; color: #3fb950; margin-left: 8px;'
      actions.appendChild(badge)
    }

    area.appendChild(actions)
    this.container.appendChild(area)
  }

  private renderResults(isDark: boolean): void {
    if (this.results.size === 0) return

    const section = document.createElement('div')
    section.style.cssText = `border-top: 1px solid ${isDark ? '#30363d' : '#d0d7de'};`

    // Tabs
    const tabs = document.createElement('div')
    tabs.style.cssText = `display: flex; border-bottom: 1px solid ${isDark ? '#30363d' : '#d0d7de'}; overflow-x: auto;`
    for (const [p, r] of this.results) {
      const tab = document.createElement('button')
      tab.textContent = PLATFORM_LABELS[p] + (r.cached ? ' 🔄' : '') + (r.duration ? ` · ${r.duration}ms` : '')
      tab.style.cssText = `
        padding: 10px 16px; border: none;
        border-bottom: 2px solid ${this.activeTab === p ? '#58a6ff' : 'transparent'};
        background: ${this.activeTab === p ? (isDark ? '#161b22' : '#f6f8fa') : 'transparent'};
        color: ${this.activeTab === p ? '#58a6ff' : (isDark ? '#8b949e' : '#57606a')};
        font-size: 13px; cursor: pointer; white-space: nowrap;
      `
      tab.addEventListener('click', () => {
        this.activeTab = p
        this.render()
      })
      tabs.appendChild(tab)
    }
    section.appendChild(tabs)

    // Active result content
    const active = this.results.get(this.activeTab)
    if (!active) return

    // Toolbar
    const toolbar = document.createElement('div')
    toolbar.style.cssText = `
      display: flex; justify-content: space-between; align-items: center;
      padding: 8px 16px; background: ${isDark ? '#161b22' : '#f6f8fa'};
      border-bottom: 1px solid ${isDark ? '#30363d' : '#d0d7de'};
    `
    toolbar.innerHTML = `
      <span style="font-size: 12px; color: ${isDark ? '#8b949e' : '#57606a'}">
        ${PLATFORM_LABELS[active.platform]}${active.duration ? ` · ${active.duration}ms` : ''}${active.cached ? ' · 来自缓存' : ''}
      </span>
      <div style="display: flex; gap: 8px;">
        <button id="__copyBtn" style="padding: 4px 10px; border-radius: 6px; border: 1px solid ${isDark ? '#30363d' : '#d0d7de'}; background: transparent; color: ${isDark ? '#8b949e' : '#57606a'}; font-size: 12px; cursor: pointer;">📋 复制</button>
        <button id="__regenBtn" style="padding: 4px 10px; border-radius: 6px; border: 1px solid ${isDark ? '#30363d' : '#d0d7de'}; background: transparent; color: ${isDark ? '#8b949e' : '#57606a'}; font-size: 12px; cursor: pointer;">🔄 重新生成</button>
      </div>
    `
    section.appendChild(toolbar)

    // Warnings
    if (active.warnings && active.warnings.length > 0) {
      const warn = document.createElement('div')
      warn.style.cssText = `padding: 8px 16px; background: ${isDark ? '#9e6a0355' : '#fff8c5'}; border-bottom: 1px solid ${isDark ? '#9e6a03' : '#f0ad4e'};`
      warn.innerHTML = active.warnings.map(w => `<div style="font-size: 12px; color: ${isDark ? '#e3b341' : '#856404'}">⚠️ ${w}</div>`).join('')
      section.appendChild(warn)
    }

    // Code
    const codeBlock = document.createElement('pre')
    codeBlock.style.cssText = `
      margin: 0; padding: 16px; background: ${isDark ? '#0d1117' : '#ffffff'};
      font-size: 13px; line-height: 1.6; overflow-x: auto; max-height: 400px; overflow-y: auto;
    `
    const code = document.createElement('code')
    code.style.cssText = 'font-family: inherit;'
    code.textContent = active.code
    codeBlock.appendChild(code)
    section.appendChild(codeBlock)

    this.container.appendChild(section)

    // Bind toolbar events
    setTimeout(() => {
      const copyBtn = document.getElementById('__copyBtn')
      const regenBtn = document.getElementById('__regenBtn')
      copyBtn?.addEventListener('click', () => {
        navigator.clipboard.writeText(active.code).catch(console.error)
        ;(copyBtn as HTMLButtonElement).textContent = '✅ 已复制'
        setTimeout(() => { if (copyBtn) copyBtn.textContent = '📋 复制' }, 2000)
      })
      regenBtn?.addEventListener('click', () => this.handleGenerate())
    }, 0)
  }

  private async handleGenerate(): Promise<void> {
    if (!this.prompt.trim() || this.loading) return
    this.loading = true
    this.showLoading(true)
    try {
      const { VibeEngine } = await import('./engine')
      const engine = new VibeEngine({ platform: this.platform })
      if (this.config.apiKey) {
        engine.configureLlm({ apiKey: this.config.apiKey })
      }
      const result = await engine.generate({
        prompt: this.prompt,
        platform: this.platform,
        model: this.config.model,
        cache: true,
      })
      const entry: GenerateResult = {
        code: result.code,
        platform: this.platform,
        cached: result.cached,
        duration: result.duration,
        warnings: result.warnings,
      }
      this.results.set(this.platform, entry)
      this.activeTab = this.platform
      this.config.onGenerate?.(result.code, this.platform)
      this.render()
    } catch (err) {
      console.error('VibeEngine error:', err)
    } finally {
      this.loading = false
    }
  }

  private async handleGenerateAll(): Promise<void> {
    const platforms: Platform[] = ['h5', 'weapp', 'alipay', 'douyin']
    this.loading = true
    this.showLoading(true)
    try {
      const { VibeEngine } = await import('./engine')
      await Promise.all(platforms.map(async (p) => {
        const engine = new VibeEngine({ platform: p })
        if (this.config.apiKey) engine.configureLlm({ apiKey: this.config.apiKey })
        const result = await engine.generate({ prompt: this.prompt || '通用功能', platform: p, cache: true })
        this.results.set(p, {
          code: result.code, platform: p, cached: result.cached,
          duration: result.duration, warnings: result.warnings,
        })
      }))
      this.activeTab = this.platform
      this.render()
    } catch (err) {
      console.error(err)
    } finally {
      this.loading = false
      this.showLoading(false)
    }
  }

  private showLoading(show: boolean): void {
    // Update generate button text
    const btns = this.container.querySelectorAll('button')
    for (const btn of Array.from(btns)) {
      if (btn.textContent?.includes('生成代码')) {
        btn.textContent = show ? '⏳ 生成中...' : '🚀 生成代码'
        ;(btn as HTMLButtonElement).disabled = show
      }
    }
  }

  /** 更新配置 */
  updateConfig(config: Partial<VibeStudioConfig>): void {
    Object.assign(this.config, config)
    if (config.defaultPlatform) this.platform = config.defaultPlatform
    if (config.defaultPrompt !== undefined) this.prompt = config.defaultPrompt
    this.render()
  }

  /** 获取所有生成结果 */
  getResults(): Map<Platform, GenerateResult> {
    return new Map(this.results)
  }

  /** 销毁实例 */
  destroy(): void {
    this.container.innerHTML = ''
  }
}
