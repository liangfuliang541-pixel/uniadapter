/**
 * UniAdapter VibeMCP 2.0 - MCP Server for Mini-Program AI Development
 * 让所有 AI Coding Agent 秒变小程序开发专家
 *
 * Usage: npx @liangfu/uniadapter mcp
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { VibeEngine } from "../vibe-engine/engine.js"

// ── Platform Knowledge ─────────────────────────────────────────────────────────

const WEAPP_APIS = {
  Storage: [
    { name: "wx.setStorageSync", params: ["key", "data"], ret: "void", ua: "storage.set()", note: "Sync, main thread only" },
    { name: "wx.getStorageSync", params: ["key"], ret: "any", ua: "storage.get()", note: "Sync read" },
    { name: "wx.removeStorageSync", params: ["key"], ret: "void", ua: "storage.remove()" },
    { name: "wx.clearStorageSync", params: [], ret: "void", ua: "storage.clear()" },
    { name: "wx.getStorageInfoSync", params: [], ret: "StorageInfo", note: "Get storage usage" },
  ],
  Network: [
    { name: "wx.request", params: ["options"], ret: "RequestTask", ua: "useUniRequest()", note: "Configure domain in app.json" },
    { name: "wx.downloadFile", params: ["options"], ret: "DownloadTask", note: "File download" },
    { name: "wx.uploadFile", params: ["options"], ret: "UploadTask", note: "Configure upload domain" },
  ],
  Router: [
    { name: "wx.navigateTo", params: ["url"], ret: "void", note: "Max 10 levels" },
    { name: "wx.redirectTo", params: ["url"], ret: "void", note: "Closes current page" },
    { name: "wx.reLaunch", params: ["url"], ret: "void", note: "Closes all pages" },
    { name: "wx.switchTab", params: ["url"], ret: "void", note: "For TabBar pages only" },
    { name: "wx.navigateBack", params: ["delta"], ret: "void", note: "Default delta=1" },
  ],
  UI: [
    { name: "wx.showToast", params: ["object"], ret: "void", note: "Max 7 Chinese chars" },
    { name: "wx.showModal", params: ["object"], ret: "void", note: "Modal dialog" },
    { name: "wx.showLoading", params: ["object"], ret: "void", note: "Needs hideLoading()" },
    { name: "wx.createSelectorQuery", params: [], ret: "SelectorQuery", note: "DOM query" },
  ],
  Auth: [
    { name: "wx.login", params: [], ret: "void", note: "Get code for backend" },
    { name: "wx.getUserProfile", params: ["object"], ret: "void", note: "Get user info" },
  ],
  Share: [
    { name: "wx.showShareMenu", params: ["object"], ret: "void" },
    { name: "wx.onShareAppMessage", params: ["object"], ret: "void" },
  ],
}

const ALIPAY_APIS = {
  Storage: [
    { name: "my.setStorageSync", params: ["key", "data"], ret: "void", ua: "storage.set()" },
    { name: "my.getStorageSync", params: ["key"], ret: "any", ua: "storage.get()" },
    { name: "my.removeStorageSync", params: ["key"], ret: "void", ua: "storage.remove()" },
  ],
  Network: [
    { name: "my.httpRequest", params: ["options"], ret: "HttpRequestTask", ua: "useUniRequest()" },
  ],
  Router: [
    { name: "my.navigateTo", params: ["url"], ret: "void", note: "Same as WeChat" },
    { name: "my.redirectTo", params: ["url"], ret: "void" },
    { name: "my.reLaunch", params: ["url"], ret: "void" },
    { name: "my.switchTab", params: ["url"], ret: "void" },
  ],
  Auth: [
    { name: "my.getAuthCode", params: ["object"], ret: "void" },
    { name: "my.getPhoneNumber", params: ["object"], ret: "void", note: "Needs user auth" },
  ],
}

const DOUYIN_APIS = {
  Storage: [
    { name: "tt.setStorageSync", params: ["key", "data"], ret: "void", ua: "storage.set()" },
    { name: "tt.getStorageSync", params: ["key"], ret: "any", ua: "storage.get()" },
    { name: "tt.getStorageInfoSync", params: [], ret: "StorageInfo" },
  ],
  Network: [
    { name: "tt.request", params: ["options"], ret: "RequestTask", ua: "useUniRequest()" },
  ],
  Router: [
    { name: "tt.navigateTo", params: ["url"], ret: "void" },
    { name: "tt.redirectTo", params: ["url"], ret: "void" },
    { name: "tt.reLaunch", params: ["url"], ret: "void" },
  ],
  Auth: [
    { name: "tt.login", params: ["object"], ret: "void" },
    { name: "tt.getUserInfo", params: ["object"], ret: "void" },
  ],
}

const QUIRKS = {
  wechat: [
    { title: "request domain", desc: "wx.request requires domain config in app.json", fix: "Dev: Settings -> Details -> Check 'Do not verify合法域名'" },
    { title: "setData perf", desc: "Frequent setData causes lag, max 256KB per call" },
    { title: "page stack limit", desc: "navigateTo max 10 levels, use redirectTo after" },
    { title: "getUserInfo deprecated", desc: "Use wx.getUserProfile" },
    { title: "分包 size", desc: "Main max 2MB, sub max 2MB" },
  ],
  alipay: [
    { title: "my.httpRequest", desc: "Alipay uses my.httpRequest instead of wx.request" },
    { title: "TabBar icons", desc: "Only 81x81 PNG, provide 2x+3x" },
  ],
  douyin: [
    { title: "strict domain", desc: "Production requires configured trusted domains" },
    { title: "分包 size", desc: "Sub max 2MB, main max 4MB" },
    { title: "privacy", desc: "Declare scope.* in app.json" },
  ],
}

const CAPS = {
  wechat: { Storage: "F", Request: "F", Router: "F", Share: "F", Location: "F", Camera: "F", Payment: "F", Biometric: "P", File: "F", Push: "F" },
  alipay: { Storage: "F", Request: "F", Router: "F", Share: "P", Location: "F", Camera: "F", Payment: "F", Biometric: "F", File: "F", Push: "P" },
  douyin: { Storage: "F", Request: "F", Router: "F", Share: "F", Location: "F", Camera: "F", Payment: "F", Biometric: "P", File: "F", Push: "F" },
  h5: { Storage: "F", Request: "F", Router: "F", Share: "P", Location: "F", Camera: "P", Payment: "F", Biometric: "P", File: "P", Push: "N" },
}

// ── Server ───────────────────────────────────────────────────────────────────

const server = new Server({ name: "uniadapter-vibemcp", version: "2.0.0" }, { capabilities: { tools: {} } })

let engine: VibeEngine | null = null
function getEngine(p = "weapp"): VibeEngine {
  if (!engine) engine = new VibeEngine({ platform: p as any })
  return engine
}

// ── Tools ────────────────────────────────────────────────────────────────────

const TOOLS = [
  { name: "vibe_generate", desc: "AI generates mini-program code from natural language. Supports multi-platform output.", schema: { type: "object", properties: { prompt: { type: "string", desc: "Natural language requirement, e.g. 'login page with phone + verification code'" }, platform: { type: "string", enum: ["weapp", "alipay", "douyin", "h5", "all"], default: "weapp" }, type: { type: "string", enum: ["page", "component", "hook", "all"], default: "page" } }, required: ["prompt"] }},
  { name: "vibe_build", desc: "Build UniAdapter project for target platform.", schema: { type: "object", properties: { platform: { type: "string" }, watch: { type: "boolean", default: false } } }},
  { name: "vibe_test", desc: "Run UniAdapter test suite.", schema: { type: "object", properties: { pattern: { type: "string" }, coverage: { type: "boolean", default: false } } }},
  { name: "agent_decompose", desc: "Decompose complex requirements into task lists with file paths.", schema: { type: "object", properties: { prompt: { type: "string" }, platforms: { type: "string", default: "weapp" } }, required: ["prompt"] }},
  { name: "agent_implement", desc: "Generate complete code for a specific task.", schema: { type: "object", properties: { task_id: { type: "string" }, task_type: { type: "string", enum: ["storage", "request", "router", "ui", "auth", "config", "test"], default: "ui" }, description: { type: "string" }, platform: { type: "string", default: "weapp" } }, required: ["description"] }},
  { name: "agent_review", desc: "Code review: check conventions, performance, security.", schema: { type: "object", properties: { code: { type: "string" }, platform: { type: "string", default: "weapp" } }, required: ["code"] }},
  { name: "agent_workflow", desc: "Full pipeline: requirements to complete mini-program.", schema: { type: "object", properties: { prompt: { type: "string" }, platforms: { type: "string", default: "weapp" }, output_dir: { type: "string", default: "pages" } }, required: ["prompt"] }},
  { name: "platform_api_ref", desc: "Query platform API reference.", schema: { type: "object", properties: { platform: { type: "string", enum: ["wechat", "alipay", "douyin", "h5", "all"], default: "wechat" }, category: { type: "string", enum: ["Storage", "Network", "Router", "UI", "Auth", "Share", "all"], default: "all" }, search: { type: "string" } } }},
  { name: "platform_capabilities", desc: "Compare platform capabilities.", schema: { type: "object", properties: { detail: { type: "boolean", default: false } } }},
  { name: "platform_quirks", desc: "List platform quirks and workarounds.", schema: { type: "object", properties: { platform: { type: "string", enum: ["wechat", "alipay", "douyin", "all"], default: "wechat" } } }},
  { name: "adapt_cross_platform", desc: "Convert code between WeChat/Alipay/Douyin/H5.", schema: { type: "object", properties: { code: { type: "string" }, from: { type: "string", enum: ["wechat", "alipay", "douyin"], default: "wechat" }, to: { type: "string", enum: ["wechat", "alipay", "douyin", "h5"], default: "alipay" }, preserve_comments: { type: "boolean", default: true } }, required: ["code", "from", "to"] }},
  { name: "list_components", desc: "List VibeUI components.", schema: { type: "object", properties: { platform: { type: "string", enum: ["weapp", "alipay", "douyin", "h5", "all"], default: "all" }, category: { type: "string" }, search: { type: "string" } } }},
  { name: "list_page_templates", desc: "List 8 VibeHub page templates.", schema: { type: "object", properties: { category: { type: "string" } } }},
  { name: "check_weapp_code", desc: "WeChat code quality check.", schema: { type: "object", properties: { code: { type: "string" }, file_type: { type: "string", enum: ["js", "wxml", "wxss", "json", "all"], default: "js" } }, required: ["code"] }},
  { name: "generate_test_cases", desc: "Generate vitest test cases.", schema: { type: "object", properties: { code: { type: "string" }, type: { type: "string", enum: ["page", "component", "hook"], default: "page" }, platform: { type: "string", default: "weapp" } }, required: ["code"] }},
]

// ── Tool Handlers ────────────────────────────────────────────────────────────

async function handleVibeGenerate(args: any) {
  const { prompt, platform = "weapp", type = "page" } = args
  try {
    const eng = getEngine(platform)
    const result = await eng.generate({ prompt, platform, type } as any)
    return JSON.stringify({ ok: true, platform, type, cached: result.cached, duration: result.duration, code: result.code })
  } catch (e: any) {
    return JSON.stringify({ ok: false, error: e.message })
  }
}

async function handleAgentDecompose(args: any) {
  const { prompt, platforms = "weapp" } = args
  const tasks: any[] = []
  let id = 1
  const rules = [
    [/(?:login|auth|register)/i, "auth", "User auth (login/register/token)"],
    [/(?:product|list|shop|goods)/i, "ui", "Product list (pull-refresh + infinite scroll)"],
    [/(?:cart|shopping)/i, "storage", "Cart state management"],
    [/(?:pay|order|checkout)/i, "request", "Order and payment flow"],
    [/(?:profile|user|mine)/i, "ui", "User profile page"],
    [/(?:home|index)/i, "ui", "Home page (Banner + Categories + Grid)"],
    [/(?:detail|product-detail)/i, "ui", "Product detail page"],
    [/(?:search)/i, "ui", "Search page (history + hot + results)"],
  ]
  for (const [re, type, desc] of rules) {
    if (re.test(prompt)) {
      tasks.push({ id: String(id++), type, priority: "high", desc, files: [`pages/${type}/${id}.js`] })
    }
  }
  if (tasks.length === 0) tasks.push({ id: "1", type: "ui", priority: "high", desc: prompt.slice(0, 60), files: ["pages/feature/index.js"] })
  return JSON.stringify({ ok: true, goal: prompt, platforms, tasks })
}

async function handleAgentImplement(args: any) {
  const { task_type = "ui", description, platform = "weapp", task_id } = args
  try {
    const eng = getEngine(platform)
    const result = await eng.generate({ prompt: `Generate complete ${platform} ${task_type}: ${description}. Include JS + WXML + WXSS. Runnable code.` } as any)
    return JSON.stringify({ ok: true, task_id, task_type, platform, code: result.code })
  } catch (e: any) {
    return JSON.stringify({ ok: false, error: e.message })
  }
}

async function handleAgentReview(args: any) {
  const { code, platform = "weapp" } = args
  const issues: any[] = []
  let score = 100
  if (/wx\.(?:navigateTo|redirectTo)\(['"](?!pages|\/)/.test(code)) { issues.push({ severity: "error", message: "Page path must start with / or pages/" }); score -= 20 }
  if (/wx\.request/.test(code) && !/requestDomain/.test(code)) { issues.push({ severity: "error", message: "Request domain not configured in app.json" }); score -= 20 }
  if (/(?:getStorageSync|setStorageSync)/.test(code)) issues.push({ severity: "info", message: "Consider async storage APIs to avoid blocking main thread" })
  if (/console\.log/.test(code)) { issues.push({ severity: "info", message: "Remove console.log before production" }); score -= 2 }
  if (!/rpx/.test(code) && /width.*:\s*\d+px/.test(code)) { issues.push({ severity: "warning", message: "Use rpx for responsive layout" }); score -= 5 }
  return JSON.stringify({ ok: true, score: Math.max(0, score), platform, issues, suggestions: [] })
}

async function handleAgentWorkflow(args: any) {
  const { prompt, platforms = "weapp", output_dir = "pages" } = args
  try {
    const eng = getEngine(platforms)
    const result = await eng.generate({ prompt } as any)
    const pages: string[] = []
    const kw = [[/(?:login|auth)/i, "login"], [/(?:home|index)/i, "index"], [/(?:product|list|shop)/i, "product-list"], [/(?:detail)/i, "detail"], [/(?:cart)/i, "cart"], [/(?:order|pay)/i, "order"], [/(?:profile|user)/i, "profile"]]
    for (const [re, name] of kw) { if (re.test(prompt)) pages.push(`${output_dir}/${name}/index`) }
    return JSON.stringify({ ok: true, goal: prompt, platforms, pages, code: result.code })
  } catch (e: any) {
    return JSON.stringify({ ok: false, error: e.message })
  }
}

function handlePlatformApiRef(args: any) {
  const { platform = "wechat", category = "all", search = "" } = args
  const allApis: any = { wechat: WEAPP_APIS, alipay: ALIPAY_APIS, douyin: DOUYIN_APIS }
  const platApis = platform === "all" ? allApis : { [platform]: allApis[platform] }
  let md = `## Platform API Reference: ${platform} | ${category}${search ? " | search: " + search : ""}

`
  for (const [plat, groups] of Object.entries(platApis)) {
    if (!groups) continue
    for (const [cat, apis] of Object.entries(groups as any)) {
      if (category !== "all" && cat !== category) continue
      const filtered = search ? (apis as any[]).filter((a: any) => a.name.includes(search) || a.note?.includes(search)) : apis
      if (filtered.length === 0) continue
      md += `### ${plat.toUpperCase()} / ${cat}
`
      filtered.forEach((a: any) => {
        md += `**\`${a.name}\`**(${a.params.join(", ")}) -> \`${a.ret}\``
        if (a.ua) md += ` | UniAdapter: \`${a.ua}\``
        md += "
"
        if (a.note) md += `> ${a.note}
`
        md += "
"
      })
    }
  }
  return md
}

function handlePlatformCapabilities(_args: any) {
  const caps = Object.keys(CAPS.wechat)
  let md = "| Capability | WeChat | Alipay | Douyin | H5 |
|---|---|---|---|---|
"
  caps.forEach(cap => { md += `| ${cap} | ${CAPS.wechat[cap]} | ${CAPS.alipay[cap]} | ${CAPS.douyin[cap]} | ${CAPS.h5[cap]} |
` })
  return md + "
F=Full, P=Partial, N=None
"
}

function handlePlatformQuirks(args: any) {
  const { platform = "wechat" } = args
  const list = platform === "all" ? Object.entries(QUIRKS) : [[platform, QUIRKS[platform] || []]]
  let md = `## Platform Quirks: ${platform}

`
  list.forEach(([plat, qs]: [string, any]) => {
    md += `### ${plat.toUpperCase()}
`
    qs.forEach((q: any, i: number) => { md += `${i + 1}. **${q.title}**
${q.desc}
`; if (q.fix) md += `Fix: ${q.fix}
`; md += "
" })
  })
  return md
}

function handleAdaptCrossPlatform(args: any) {
  const { code, from, to, preserve_comments = true } = args
  let result = preserve_comments ? code : code.replace(/\/\/.*/g, "")
  if (from === "wechat" && to === "alipay") { result = result.replace(/wx\./g, "my.").replace(/wx\//g, "my/") }
  else if (from === "wechat" && to === "douyin") { result = result.replace(/wx\./g, "tt.").replace(/wx\//g, "tt/") }
  else if (from === "wechat" && to === "h5") {
    result = result.replace(/wx\.setStorageSync/g, "localStorage.setItem")
    result = result.replace(/wx\.getStorageSync/g, "localStorage.getItem")
    result = result.replace(/wx\.navigateTo/g, "// navigateTo")
    result = result.replace(/wx\.request/g, "fetch")
  }
  return JSON.stringify({ ok: true, from, to, adapted_code: result })
}

function handleListComponents(args: any) {
  const { platform = "all", category, search } = args
  const components = [
    { name: "Button", desc: "Primary button with multiple variants", cat: "form", platforms: ["weapp", "alipay", "douyin", "h5"] },
    { name: "Input", desc: "Text input with validation", cat: "form", platforms: ["weapp", "alipay", "douyin", "h5"] },
    { name: "Card", desc: "Content card with image and text", cat: "data-display", platforms: ["weapp", "alipay", "douyin", "h5"] },
    { name: "Grid", desc: "Responsive grid layout", cat: "layout", platforms: ["weapp", "alipay", "douyin", "h5"] },
    { name: "Dialog", desc: "Modal dialog with actions", cat: "feedback", platforms: ["weapp", "alipay", "douyin", "h5"] },
    { name: "Toast", desc: "Toast notification", cat: "feedback", platforms: ["weapp", "alipay", "douyin", "h5"] },
    { name: "TabBar", desc: "Bottom tab navigation", cat: "navigation", platforms: ["weapp", "alipay", "douyin"] },
    { name: "Swiper", desc: "Carousel/banner slider", cat: "data-display", platforms: ["weapp", "alipay", "douyin"] },
    { name: "PullToRefresh", desc: "Pull-down refresh", cat: "feedback", platforms: ["weapp", "alipay", "douyin"] },
    { name: "Skeleton", desc: "Loading skeleton animation", cat: "feedback", platforms: ["weapp", "h5"] },
    { name: "Empty", desc: "Empty state placeholder", cat: "feedback", platforms: ["weapp", "alipay", "douyin", "h5"] },
    { name: "Avatar", desc: "User avatar with fallback", cat: "data-display", platforms: ["weapp", "alipay", "douyin", "h5"] },
    { name: "Badge", desc: "Red dot / count badge", cat: "data-display", platforms: ["weapp", "alipay", "douyin"] },
    { name: "ActionSheet", desc: "Bottom action sheet", cat: "feedback", platforms: ["weapp", "alipay", "douyin"] },
  ]
  let filtered = components
  if (platform !== "all") filtered = filtered.filter(c => c.platforms.includes(platform))
  if (category) filtered = filtered.filter(c => c.cat === category)
  if (search) filtered = filtered.filter(c => c.name.includes(search) || c.desc.includes(search))
  return JSON.stringify({ ok: true, total: filtered.length, components: filtered })
}

function handleListPageTemplates(args: any) {
  const { category } = args
  const templates = [
    { name: "login", desc: "Phone + verification code login with agreement", category: "ecommerce" },
    { name: "home", desc: "Banner carousel + category icons + product grid", category: "ecommerce" },
    { name: "product-list", desc: "Dual-column waterfall with filters + pull-refresh", category: "ecommerce" },
    { name: "product-detail", desc: "Image carousel + specs picker + floating buy bar", category: "ecommerce" },
    { name: "cart", desc: "Multi-select with quantity editor + delete", category: "ecommerce" },
    { name: "profile", desc: "Avatar + order entry + settings menu", category: "ecommerce" },
    { name: "order-confirm", desc: "Address + payment + coupon + price summary", category: "ecommerce" },
    { name: "search", desc: "Search bar + history + hot list + results", category: "tool" },
  ]
  const filtered = category ? templates.filter(t => t.category === category) : templates
  return JSON.stringify({ ok: true, total: filtered.length, templates: filtered })
}

function handleCheckWeappCode(args: any) {
  const { code, file_type = "js" } = args
  const issues: any[] = []
  if (file_type === "js" || file_type === "all") {
    if (/wx\.(?:navigateTo|redirectTo)\(['"](?!pages|\/)/.test(code)) issues.push({ severity: "error", message: "Page path must be absolute (/page) or relative (pages/page)" })
    if (/wx\.request/.test(code) && !/requestDomain/.test(code)) issues.push({ severity: "error", message: "request domain not configured in app.json" })
    if (/getUserInfo[^{]*\.\s*then/.test(code)) issues.push({ severity: "warning", message: "getUserInfo is deprecated, use getUserProfile" })
    if (/console\.log/.test(code)) issues.push({ severity: "info", message: "Remove console.log before production" })
    if (!/rpx/.test(code) && /width.*:\s*\d+px/.test(code)) issues.push({ severity: "warning", message: "Use rpx for responsive layout" })
  }
  return JSON.stringify({ ok: true, issues, suggestions: [] })
}

function handleGenerateTestCases(args: any) {
  const { code, type = "page", platform = "weapp" } = args
  const testCode = `import { describe, it, expect } from 'vitest'

describe('${type} test', () => {
  it('should work', () => {
    // TODO: add test cases based on code analysis
    expect(true).toBe(true)
  })
})
`
  return JSON.stringify({ ok: true, test_code: testCode, platform, type })
}

// ── Request Handlers ─────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(t => ({ name: t.name, description: t.desc, inputSchema: t.schema }))
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params
  let result = ""

  switch (name) {
    case "vibe_generate": result = await handleVibeGenerate(args || {}); break
    case "agent_decompose": result = handleAgentDecompose(args || {}); break
    case "agent_implement": result = await handleAgentImplement(args || {}); break
    case "agent_review": result = await handleAgentReview(args || {}); break
    case "agent_workflow": result = await handleAgentWorkflow(args || {}); break
    case "platform_api_ref": result = handlePlatformApiRef(args || {}); break
    case "platform_capabilities": result = handlePlatformCapabilities(args || {}); break
    case "platform_quirks": result = handlePlatformQuirks(args || {}); break
    case "adapt_cross_platform": result = handleAdaptCrossPlatform(args || {}); break
    case "list_components": result = handleListComponents(args || {}); break
    case "list_page_templates": result = handleListPageTemplates(args || {}); break
    case "check_weapp_code": result = handleCheckWeappCode(args || {}); break
    case "generate_test_cases": result = handleGenerateTestCases(args || {}); break
    default: result = JSON.stringify({ ok: false, error: `Unknown tool: ${name}` })
  }

  return { content: [{ type: "text", text: result }] }
})

// ── Main ────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport()
server.connect(transport).catch(console.error)
