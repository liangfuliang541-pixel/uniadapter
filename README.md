# ✨ UniAdapter 2.0 — Vibe Coding × 跨端适配

[English](README-en.md) | 简体中文

> **2025 年最火开发范式**：用自然语言描述功能，AI 自动生成跨端最优代码。
> 一个框架，解决 Taro/uni-app 的所有适配痛点。

[![npm](https://img.shields.io/npm/v/@liangfu/uniadapter?style=flat-square)](https://www.npmjs.com/package/@liangfu/uniadapter)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61dafb?style=flat-square)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![stars](https://img.shields.io/github/stars/liangfuliang541-pixel/uniadapter?style=flat-square)](https://github.com/liangfuliang541-pixel/uniadapter)
[![issues](https://img.shields.io/github/issues/liangfuliang541-pixel/uniadapter?style=flat-square)](https://github.com/liangfuliang541-pixel/uniadapter/issues)

---

## 🎯 核心理念

**UniAdapter = 统一适配层 + AI 代码生成引擎**

传统方案：
```
写代码 → 适配各平台 → 调试差异 → 修复兼容问题 → 维护多套代码  ❌ 痛苦
```

UniAdapter 2.0：
```
描述你想要什么 → AI 生成最优跨端代码 → 直接使用  ✅ 快乐
```

---

## ⚡ VibeEngine — 描述即所得

### 什么是 Vibe Coding？

[Vibe Coding](https://www.collinsdictionary.com/word-lists/a-z-in-vogue/collins-dictionary-word-of-the-year-2025) 是 2025 年柯林斯词典年度词汇，由 OpenAI 联合创始人 Andrej Karpathy 提出：

> *"你只管描述想要什么，AI 负责写代码"*

UniAdapter 将这一理念引入跨端开发领域。

### 它如何工作？

```typescript
import { VibeEngine } from '@liangfu/uniadapter'

// 初始化（自动检测当前平台）
const engine = new VibeEngine({ platform: 'weapp' })

// 用自然语言描述你的需求
const result = await engine.generate({
  prompt: '用户登录并保存 token，支持下拉刷新',
  apiKey: process.env.OPENAI_API_KEY, // 或 DEEPSEEK_API_KEY
  model: 'deepseek-chat', // gpt-4o / claude-3.5-sonnet / deepseek-chat
})

console.log(result.code)
// 输出：微信小程序最优实现，自动适配 wx.login / wx.setStorageSync / ...
console.log(result.cached)    // 是否来自缓存
console.log(result.duration)  // 生成耗时
```

### 多平台一次生成

```typescript
import { VibeEngine } from '@liangfu/uniadapter'

const engine = new VibeEngine()
const platforms = ['weapp', 'alipay', 'douyin', 'h5'] as const

// 并行生成所有平台版本
const allResults = await engine.generateAll(
  '获取用户信息并显示头像昵称',
  platforms
)

for (const [platform, result] of allResults) {
  console.log(`=== ${platform} ===`)
  console.log(result.code)
}
```

### 支持的平台

| 平台 | 状态 | Storage | Request | Crypto | Location | Share |
|------|------|---------|---------|--------|----------|-------|
| 🌐 **Web/H5** | ✅ 完善 | localStorage | fetch | Web Crypto | Geolocation API | Web Share |
| 💬 **微信小程序** | ✅ 完善 | wx.setStorageSync | wx.request | wx.request httpEncrypt | wx.getLocation | wx.showShareMenu |
| 💰 **支付宝小程序** | ✅ 完善 | my.setStorageSync | my.httpRequest | my.httpRequest | my.getLocation | my.openCustomerServiceChat |
| 🎵 **抖音小程序** | ✅ 完善 | tt.setStorageSync | tt.request | tt.request | tt.getLocation | tt.shareAppMessage |
| 📕 **小红书小程序** | ✅ 完善 | sylinks.* | sylinks.request | sylinks.request | sylinks.getLocation | sylinks.share |
| 🗺️ **高德地图** | ✅ 完善 | 原生 API | 原生 API | 原生 API | AMap.Location | 原生 API |
| ⚛️ **React Native** | ✅ 完善 | AsyncStorage | fetch | crypto-js | @react-native-community/geolocation | React Native Share |

---

## 🚀 快速开始

### 安装

```bash
npm install @liangfu/uniadapter
```

### 方式一：直接使用适配器（无 AI）

```typescript
import { createStorageAdapter, createRequestAdapter, useUniState } from '@liangfu/uniadapter'

// 存储 — 一次编写，所有平台工作
const storage = await createStorageAdapter()
await storage.set('token', 'user_token_123')
const token = await storage.get('token')

// 请求 — 自动适配各平台网络 API
const request = createRequestAdapter()
const data = await request.get('/api/user/profile')

// React Hooks
const { state, setState } = useUniState('user', null)
```

### 方式二：VibeEngine（AI 生成，推荐）

```bash
# 设置环境变量
export OPENAI_API_KEY=sk-xxx
# 或
export DEEPSEEK_API_KEY=sk-xxx
# 或
export ANTHROPIC_API_KEY=sk-xxx
```

```typescript
import { VibeEngine } from '@liangfu/uniadapter'

const engine = new VibeEngine({
  platform: 'weapp',
  cacheTtl: 3600000, // 缓存 1 小时
})

// 自然语言 → 平台最优代码
const { code } = await engine.generate({
  prompt: '实现图片上传，支持压缩和进度显示',
  cache: true, // 启用缓存
})

// 保存生成的代码到文件
// ...
```

### 方式三：VibeStudio（可视化 IDE）

```tsx
import { VibeStudio } from '@liangfu/uniadapter/vibe'

// 在 React 中嵌入 VibeStudio IDE
function App() {
  return (
    <VibeStudio
      defaultPrompt="用户登录并保存 token"
      defaultPlatform="weapp"
      apiKey={process.env.OPENAI_API_KEY}
      onGenerate={(result) => {
        // 开发者获取生成的代码
        console.log(result.code)
      }}
    />
  )
}
```

---

## 🏗️ 架构

```
┌─────────────────────────────────────────────┐
│                 VibeEngine                  │
│  自然语言理解 → 意图识别 → 代码生成          │
├─────────────────────────────────────────────┤
│              UniAdapter Core                │
│  统一 API (IStorage / IRequest / ...)       │
├──────────┬──────────┬──────────┬──────────┤
│  H5适配器 │ 微信适配器│ 支付宝适配│ 抖音适配  │
│          │          │          │          │
├──────────┴──────────┴──────────┴──────────┤
│           Platform Capabilities             │
│  Storage · Request · Crypto · Location     │
└─────────────────────────────────────────────┘
```

---

## 🔑 核心 API

### Storage（存储）

```typescript
import { createStorageAdapter } from '@liangfu/uniadapter'

const storage = await createStorageAdapter()

// 同步操作
await storage.set(key, value)
await storage.get<T>(key)
await storage.remove(key)
await storage.clear()

// 加密存储（敏感数据）
await storage.setSecure('token', sensitiveValue)
```

### Request（网络请求）

```typescript
import { createRequestAdapter } from '@liangfu/uniadapter'

const request = createRequestAdapter()

// GET
const data = await request.get('/api/users')

// POST
const result = await request.post('/api/login', { username, password })

// 文件上传
const uploaded = await request.upload('/api/upload', file, {
  onProgress: (percent) => console.log(`${percent}%`)
})
```

### Hooks

```typescript
import { useUniState, useUniRequest, usePlatform } from '@liangfu/uniadapter'

// 统一状态管理（跨平台持久化）
const [token, setToken] = useUniState('token', '')

// 统一请求（带 Loading 状态）
const { data, loading, error } = useUniRequest('/api/user', {
  method: 'GET',
  headers: { Authorization: `Bearer ${token}` }
})

// 获取当前平台信息
const platform = usePlatform()
// platform: { name: 'weapp', capabilities: { storage: true, ... } }
```

---

## 🆚 对比其他框架

| 特性 | UniAdapter | Taro | uni-app | Remax |
|------|-----------|------|---------|-------|
| **Vibe Coding AI 生成** | ✅ 原生支持 | ❌ | ❌ | ❌ |
| **统一 API** | ✅ 完整 | ⚠️ 有限 | ⚠️ 部分 | ⚠️ 部分 |
| **TypeScript** | ✅ 5.0+ | ✅ | ⚠️ | ✅ |
| **包大小** | ~8KB gzip | ~200KB | ~300KB | ~150KB |
| **学习曲线** | 平缓 | 陡峭 | 较陡 | 中等 |
| **React Native** | ✅ | ✅ | ❌ | ⚠️ |
| **小红书小程序** | ✅ | ❌ | ❌ | ❌ |
| **配置复杂度** | 低 | 高 | 中 | 中 |

---

## 📖 VibeEngine 意图类型

VibeEngine 自动识别以下意图类型：

| 意图类型 | 关键词示例 | 生成内容 |
|---------|-----------|---------|
| **storage** | 存/取/删/缓存/token | Storage API 最优实现 |
| **request** | 请求/加载/网络/fetch | 跨平台请求适配代码 |
| **navigation** | 跳转/导航/返回 | 页面路由代码 |
| **ui** | 显示/列表/弹窗/按钮 | UI 组件代码 |
| **system** | 分享/登录/定位/权限 | 平台系统能力调用 |

---

## ⚙️ 配置

### 环境变量

```bash
# LLM API Keys（至少配置一个）
OPENAI_API_KEY=sk-xxx
DEEPSEEK_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-xxx

# 缓存配置（可选）
UNIADAPTER_CACHE_TTL=3600000
```

### VibeEngine 配置

```typescript
const engine = new VibeEngine({
  platform: 'weapp',           // 默认平台（自动检测）
  cacheTtl: 3600000,           // 缓存 TTL（毫秒）
})

// 配置 LLM
engine.configureLlm({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.deepseek.com', // 支持代理
  model: 'deepseek-chat',
})
```

---

## 📦 发布说明

```bash
# 构建库
npm run build

# 发布到 npm
npm publish
```

---

## 🤝 如何贡献

欢迎提交 Issue 和 PR！

1. Fork 本仓库
2. 创建特性分支 `git checkout -b feature/amazing`
3. 提交更改 `git commit -m 'feat: add amazing feature'`
4. 推送分支 `git push origin feature/amazing`
5. 创建 Pull Request

---

## 📄 License

MIT License © 2024 [liangfuliang541-pixel](https://github.com/liangfuliang541-pixel)

---

<p align="center">
  <strong>给个 Star 吧！</strong><br>
  如果这个项目对你有帮助，请给我们一个 ⭐️
</p>
